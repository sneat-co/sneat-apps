import { HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SneatApiService } from '@sneat/api';
import { AuthStatus, SneatAuthStateService } from '@sneat/auth';
import { IUserTeamInfo } from '@sneat/auth-models';
import { IRecord } from '@sneat/data';
import { IMemberBrief, ITeamDto, ITeamMetric, MemberRole } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	ICreateTeamRequest,
	ICreateTeamResponse,
	ITeamContext,
	ITeamMemberRequest,
	ITeamRequest,
} from '@sneat/team/models';
import { ISneatUserState, SneatUserService } from '@sneat/user';
import { BehaviorSubject, Observable, ReplaySubject, Subscription, switchMap, throwError } from 'rxjs';
import { filter, first, map, tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class TeamService {
	private userID?: string;

	private currentUserTeams?: IUserTeamInfo[];

	private teams$: { [id: string]: BehaviorSubject<ITeamContext> } = {};
	private subscriptions: Subscription[] = [];

	constructor(
		readonly sneatAuthStateService: SneatAuthStateService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly db: AngularFirestore,
		private readonly userService: SneatUserService,
		private readonly sneatApiService: SneatApiService,
	) {
		const onAuthStatusChanged = (status: AuthStatus): void => {
			if (status === 'notAuthenticated') {
				this.unsubscribe('signed out');
			}
		};
		sneatAuthStateService.authStatus.subscribe(onAuthStatusChanged);

		const processUserRecordInTeamService = (
			userState: ISneatUserState,
		): void => {
			console.log('processUserRecordInTeamService()', userState);
			const user = userState?.record;
			if (!user) {
				// this.userID = undefined;
				if (this.subscriptions?.length) {
					this.unsubscribe('user record is empty');
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
				user.teams?.forEach(this.subscribeForFirestoreTeamChanges);
			}
		};
		// We are intentionally not un-subscribing from user record updates. TODO: why?
		this.userService.userState.subscribe({
			next: processUserRecordInTeamService,
			error: (err) =>
				this.errorLogger.logError(err, 'failed to load user record'),
		});
	}

	public createTeam(request: ICreateTeamRequest): Observable<IRecord<ITeamDto>> {
		return this.sneatApiService
			.post<ICreateTeamResponse>('teams/create_team', request)
			.pipe(map((response) => response.team));
	}

	public getTeam(id: string): Observable<ITeamContext> {
		return this.watchTeam(id)
			.pipe(
				first(),
			);
	}

	public watchTeam(id: string): Observable<ITeamContext> {
		console.log(`TeamService.watchTeam(${id})`);
		let subj = this.teams$[id];
		if (!subj) {
			let teamContext: ITeamContext | undefined = undefined;
			if (this.currentUserTeams) {
				const userTeamInfo = this.currentUserTeams.find(t => t.id === id);
				if (userTeamInfo) {
					teamContext = { id, brief: userTeamInfo };
				}
			}
			this.teams$[id] = subj = new BehaviorSubject<ITeamContext>(teamContext || { id });
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
		const id = teamRecord.id
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
		const processRemoveTeamMemberResponse = (): Observable<ITeamContext> =>
			this.getTeam(teamRecord.id).pipe(
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
					team: teamRecord.id,
				};
				this.sneatApiService
					.post<ITeamDto>('team/leave_team', teamRequest)
					.pipe(
						map(teamDto => {
							const teamContext: ITeamContext = {id, brief: {id, ...teamDto}, dto: teamDto};
							return teamContext;
						}),
						switchMap(processRemoveTeamMemberResponse),
						ensureTeamRecordExists,
					);
			}
		}
		const request: ITeamMemberRequest = {
			team: teamRecord.id,
			member: memberId,
		};
		return this.sneatApiService
			.post('team/remove_member', request)
			.pipe(
				switchMap(processRemoveTeamMemberResponse),
				ensureTeamRecordExists,
			);
	}

	public onTeamUpdated(team: ITeamContext): void {
		console.log(
			'TeamService.onTeamUpdated',
			team ? { id: team.id, data: { ...team.dto } } : team,
		);
		let team$ = this.teams$[team.id];
		if (!team$) {
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

	private readonly subscribeForFirestoreTeamChanges = (teamInfo: IUserTeamInfo): void => {
		console.log('subscribeForFirestoreTeamChanges', teamInfo);
		const { id } = teamInfo;
		let subj = this.teams$[id];
		if (!subj) {
			this.teams$[id] = subj = new BehaviorSubject<ITeamContext>({id: teamInfo.id, brief: teamInfo});
		}

		const o: Observable<ITeamContext> = this.db
			.collection('teams')
			.doc<ITeamDto>(id)
			.snapshotChanges()
			.pipe(
				tap((team) => {
					console.log('New team snapshot from Firestore:', team);
				}),
				filter((documentSnapshot) => documentSnapshot.type === 'value' || documentSnapshot.type === 'added'),
				map((documentSnapshot) => documentSnapshot.payload),
				map((teamDoc) =>
					teamDoc.exists ? (teamDoc.data() as ITeamDto) : null,
				),
				map((dto: ITeamDto | null) => ({id, brief: teamInfo, dto: dto || undefined})),
				tap((team) => {
					console.log('New team record from Firestore:', team);
					subj.next(team);
				}),
			);
		this.subscriptions.push(o.subscribe(subj));
	};

	private unsubscribe(on: string): void {
		console.log('TeamService: unsubscribe on ' + on);
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
	invitedBy: IUserTeamInfo;
}
