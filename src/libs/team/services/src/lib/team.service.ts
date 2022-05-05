import { HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SneatApiService } from '@sneat/api';
import { AuthStatus, AuthStatuses, SneatAuthStateService } from '@sneat/auth';
import { IUserTeamBrief } from '@sneat/auth-models';
import { IRecord } from '@sneat/data';
import { IMemberBrief, ITeamBrief, ITeamDto, ITeamMetric, MemberRole } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	ICreateTeamRequest,
	ICreateTeamResponse,
	ITeamContext,
	ITeamMemberRequest, ITeamRef,
	ITeamRequest,
} from '@sneat/team/models';
import { ISneatUserState, SneatUserService } from '@sneat/user';
import { BehaviorSubject, Observable, Subscription, switchMap, throwError } from 'rxjs';
import { filter, first, map, tap } from 'rxjs/operators';

const teamBriefFromUserTeamInfo = (v: IUserTeamBrief): ITeamBrief => ({ ...v, type: v.teamType });

@Injectable({ providedIn: 'root' })
export class TeamService {
	private userID?: string;

	private currentUserTeams?: IUserTeamBrief[];

	private teams$: { [id: string]: BehaviorSubject<ITeamContext> } = {};
	private subscriptions: Subscription[] = [];

	constructor(
		readonly sneatAuthStateService: SneatAuthStateService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly db: AngularFirestore,
		private readonly userService: SneatUserService,
		private readonly sneatApiService: SneatApiService,
	) {
		console.log('TeamService.constructor()');
		const onAuthStatusChanged = (status: AuthStatus): void => {
			if (status === 'notAuthenticated') {
				this.unsubscribe('signed out');
			}
		};
		sneatAuthStateService.authStatus.subscribe(onAuthStatusChanged);

		// We are intentionally not un-subscribing from user record updates. TODO: why?
		this.userService.userState.subscribe({
			next: this.processUserRecordInTeamService,
			error: this.errorLogger.logErrorHandler('failed to load user record'),
		});
	}

	private readonly processUserRecordInTeamService = (userState: ISneatUserState) => {
		console.log('TeamService.processUserRecordInTeamService()', userState);
		const user = userState?.record;
		if (!user) {
			// this.userID = undefined;
			if (userState.status === AuthStatuses.notAuthenticated && this.subscriptions?.length) {
				this.unsubscribe('user is not authenticated and active team subscriptions');
			}
			return;
		}
		if (userState.user?.uid !== this.userID) {
			if (this.userID) {
				this.unsubscribe('user id changed');
			}
			this.userID = userState.user?.uid;
		}
		this.currentUserTeams = user?.teams;

		if (user?.teams) {
			user.teams?.forEach(this.subscribeForUserTeamChanges);
		}
	};

	public createTeam(request: ICreateTeamRequest): Observable<IRecord<ITeamDto>> {
		return this.sneatApiService
			.post<ICreateTeamResponse>('teams/create_team', request)
			.pipe(map((response) => response.team));
	}

	public getTeam(ref: ITeamRef): Observable<ITeamContext> {
		return this.watchTeam(ref)
			.pipe(
				first(),
			);
	}

	public watchTeam(ref: ITeamRef): Observable<ITeamContext> {
		console.log(`TeamService.watchTeam(ref=${JSON.stringify(ref)})`);
		if (!ref) {
			throw new Error('team ref is a required parameter');
		}
		const {id} = ref;
		let subj = this.teams$[id];
		if (subj) {
			return subj.asObservable();
		}
		let teamContext: ITeamContext = ref;
		if (this.currentUserTeams) {
			const userTeamInfo = this.currentUserTeams.find(t => t.id === id);
			if (userTeamInfo) {
				teamContext = { id, type: userTeamInfo.teamType, brief: teamBriefFromUserTeamInfo(userTeamInfo) };
			}
		}
		subj = new BehaviorSubject<ITeamContext>(teamContext);
		this.teams$[id] = subj;
		if (this.userService.currentUserId) {
			this.subscribeForTeamChanges(subj);
		} else {
			this.userService.userState
				.pipe(
					filter(v => v.status === AuthStatuses.authenticated),
					first(),
				).subscribe({
				next: () => this.subscribeForTeamChanges(subj),
			});
		}
		return subj.asObservable();
	}

	public changeMemberRole(
		team: ITeamContext,
		memberId: string,
		role: MemberRole,
	): Observable<ITeamContext> {
		let member = team?.dto?.members.find((m: IMemberBrief) => m.id === memberId);
		if (!member) {
			return throwError(() => 'member not found by ID in team record');
		}
		return this.sneatApiService
			.post(`team/change_member_role`, {
				team: team.id,
				member: memberId,
				role,
			})
			.pipe(
				map(() => {
					if (!member) {
						throw new Error('member is no longer available');
					}
					member = { ...member, roles: [role] };
					return team;
				}),
			);
	}

	public removeTeamMember(
		teamRecord: ITeamContext,
		memberId: string,
	): Observable<ITeamContext> {
		console.log(
			`removeTeamMember(teamId: ${teamRecord?.id}, memberId=${memberId})`,
		);
		if (!teamRecord) {
			return throwError(() => 'teamRecord parameters is required');
		}
		const id = teamRecord.id;
		if (!id) {
			return throwError(() => 'teamRecord.id parameters is required');
		}
		if (!memberId) {
			return throwError(() => 'memberId is required parameter');
		}
		const updateTeam = (team: ITeamContext) => {
			if (team?.dto) {
				team = {
					...team,
					dto: {
						...team.dto,
						members: team.dto.members.filter((m: IMemberBrief) => m.id !== memberId),
					},
				};
			}
			this.onTeamUpdated(team);
		};
		const processRemoveTeamMemberResponse = (team: ITeamRef): Observable<ITeamContext> =>
			this.getTeam(team).pipe(
				tap(updateTeam),
				// map(team => team.members.find(m => m.uid === this.userService.currentUserId) ? team : null),
			);
		const ensureTeamRecordExists = map((team: ITeamContext) => {
			if (!team?.dto) {
				throw new Error('team record is expected to exist');
			}
			return team;
		});
		if (teamRecord?.dto?.members) {
			const member = teamRecord.dto.members.find((m: IMemberBrief) => m.id === memberId);
			if (member?.uid === this.userService.currentUserId) {
				const teamRequest: ITeamRequest = {
					teamID: teamRecord.id,
				};
				this.sneatApiService
					.post<ITeamDto>('team/leave_team', teamRequest)
					.pipe(
						map(teamDto => {
							const teamContext: ITeamContext = { id, type: teamDto.type, brief: { id, ...teamDto }, dto: teamDto };
							return teamContext;
						}),
						switchMap(processRemoveTeamMemberResponse),
						ensureTeamRecordExists,
					);
			}
		}
		const request: ITeamMemberRequest = {
			teamID: teamRecord.id,
			member: memberId,
		};
		return this.sneatApiService
			.post('team/remove_member', request)
			.pipe(
				switchMap(() => processRemoveTeamMemberResponse(teamRecord)),
				ensureTeamRecordExists,
			);
	}

	public onTeamUpdated(team: ITeamContext): void {
		console.log(
			'TeamService.onTeamUpdated',
			team ? { id: team.id, dto: { ...team.dto } } : team,
		);
		let team$ = this.teams$[team.id];
		if (team$) {
			const prevTeam = team$.value;
			team = { ...prevTeam, ...team };
		} else {
			this.teams$[team.id] = team$ = new BehaviorSubject<ITeamContext>(team);
		}
		team$.next(team);
	}

	public getTeamJoinInfo(
		teamId: string,
		pin: number,
	): Observable<IJoinTeamInfoResponse> {
		return this.sneatApiService.getAsAnonymous(
			'team/join_info',
			new HttpParams({
				fromObject: {
					id: teamId,
					pin: pin.toString(),
				},
			}),
		);
	}

	public joinTeam(teamId: string, pin: number): Observable<ITeamDto> {
		const params = new HttpParams({
			fromObject: {
				id: teamId,
				pin: pin.toString(),
			},
		});
		return this.sneatApiService.post(
			'team/join_team?' + params.toString(),
			null,
		);
	}

	public refuseToJoinTeam(teamId: string, pin: number): Observable<ITeamDto> {
		const params = new HttpParams({
			fromObject: {
				id: teamId,
				pin: pin.toString(),
			},
		});
		return this.sneatApiService.post(
			'team/refuse_to_join_team?' + params.toString(),
			null,
		);
	}

	// TODO: move to separate module
	public deleteMetrics(team: string, metrics: string[]): Observable<void> {
		return this.sneatApiService.post('team/remove_metrics', {
			team,
			metrics,
		});
	}

	// TODO: move to separate module
	public addMetric(team: string, metric: ITeamMetric): Observable<void> {
		if (!team) {
			return throwError(() => 'team parameter is required');
		}
		const params = new HttpParams({ fromObject: { id: team } });
		return this.sneatApiService.post(
			'team/add_metric?' + params.toString(),
			{ metric },
		);
	}

	private readonly subscribeForUserTeamChanges = (userTeamInfo: IUserTeamBrief): void => {
		console.log('subscribeForFirestoreTeamChanges', userTeamInfo);
		const { id } = userTeamInfo;
		let subj = this.teams$[id];
		if (subj) {
			let team = subj.value;
			if (!team.type) {
				team = { ...team, type: userTeamInfo.teamType, brief: teamBriefFromUserTeamInfo(userTeamInfo) };
				subj.next(team);
			}
			return;
		}

		const team: ITeamContext = {
			id: userTeamInfo.id,
			type: userTeamInfo.teamType,
			brief: teamBriefFromUserTeamInfo(userTeamInfo),
		};
		this.teams$[id] = subj = new BehaviorSubject<ITeamContext>(team);

		this.subscribeForTeamChanges(subj);
	};

	private subscribeForTeamChanges(subj: BehaviorSubject<ITeamContext>): void {
		const t = subj.value;
		console.log(`TeamService.subscribeForTeamChanges(${t.id})`);
		const { id } = t;
		const o: Observable<ITeamContext> = this.db
			.collection('teams')
			.doc<ITeamDto>(id)
			.snapshotChanges()
			.pipe(
				tap((team) => {
					console.log('TeamService.subscribeForTeamChanges() => New team snapshot from Firestore:', team);
				}),
				filter((documentSnapshot) => documentSnapshot.type === 'value' || documentSnapshot.type === 'added'),
				map((documentSnapshot) => documentSnapshot.payload),
				map((teamDoc) =>
					teamDoc.exists ? (teamDoc.data() as ITeamDto) : null,
				),
				map((dto: ITeamDto | null) => {
					let team: ITeamContext = { id, brief: t.brief, dto: dto || undefined };
					const prevTeam = this.teams$[id].value;
					console.log('prevTeam', prevTeam);
					if (prevTeam.assets) {
						team = { ...team, assets: prevTeam.assets };
						console.log('Reusing assets from prev context');
					}
					return team;
				}),
				tap((team) => {
					console.log('TeamService.subscribeForTeamChanges() => New team from Firestore:', team);
					// subj.next(team);
				}),
			);
		this.subscriptions.push(o.subscribe({
			next: value => subj.next(value),
			error: this.errorLogger.logErrorHandler('failed to watch team with id=' + id),
		}));
	}

	private unsubscribe(on: string): void {
		console.log(`TeamService.unsubscribe(on=${on})`);
		try {
			this.subscriptions.forEach((s) => s.unsubscribe());
			this.subscriptions = [];
			this.teams$ = {};
			console.log('unsubscribed => teams$:', this.teams$);
		} catch (e) {
			this.errorLogger.logError(e, 'TeamService failed to unsubscribe');
		}
	}
}

export interface IJoinTeamInfoResponse {
	team: ITeamDto;
	invitedBy: IUserTeamBrief;
}
