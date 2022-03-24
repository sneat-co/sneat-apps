import { Observable, ReplaySubject, Subscription, switchMap, throwError } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { filter, first, map, tap } from 'rxjs/operators';

import { Inject, Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { SneatApiService } from '@sneat/api';
import { ISneatUserState, SneatUserService } from '@sneat/user';
import { IRecord } from '@sneat/data';
import { IUserTeamInfo, IUserTeamInfoWithId } from '@sneat/auth-models';
import {
	ICreateTeamRequest,
	ICreateTeamResponse,
	IMemberInfo,
	ITeam,
	ITeamMemberRequest,
	ITeamMetric,
	ITeamRequest,
	MemberRole,
} from '@sneat/team/models';
import { AuthStatus, SneatAuthStateService } from '@sneat/auth';

@Injectable({ providedIn: 'root' })
export class TeamService {
	private userId?: string;

	private teams$: { [id: string]: ReplaySubject<ITeam | undefined> } = {};
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
			console.log('processUserRecordInTeamService()');
			const user = userState?.record;
			if (!user) {
				// this.userId = undefined;
				if (this.subscriptions?.length) {
					this.unsubscribe('user record is empty');
				}
				return;
			}
			if (userState.user?.uid !== this.userId) {
				if (this.userId) {
					this.unsubscribe('user id changed');
				}
				this.userId = userState.user?.uid;
			}
			if (user?.teams) {
				const subscribeForFirestoreTeamChanges = (
					teamInfo: IUserTeamInfoWithId,
				): void => {
					const { id } = teamInfo;
					let subj = this.teams$[id];
					console.log('subscribeForFirestoreTeamChanges, subj:', subj);
					if (!subj) {
						this.teams$[id] = subj = new ReplaySubject<ITeam | undefined>(1);
					}

					const o = this.db
						.collection('teams')
						.doc<ITeam>(id)
						.snapshotChanges()
						.pipe(
							filter((documentSnapshot) => documentSnapshot.type === 'value'),
							map((documentSnapshot) => documentSnapshot.payload),
							map((teamDoc) =>
								teamDoc.exists ? (teamDoc.data() as ITeam) : null,
							),
							tap((team) => {
								console.log('New team record from Firestore:', team);
							}),
							map(team => team || undefined),
						);
					this.subscriptions.push(o.subscribe(subj));
				};
				Object.entries(user.teams).forEach(([id, team]) =>
					subscribeForFirestoreTeamChanges({
						...(team as IUserTeamInfoWithId),
						id,
					}),
				);
			}
		};
		// We are intentionally not un-subscribing from user record updates. TODO: why?
		this.userService.userState.subscribe({
			next: processUserRecordInTeamService,
			error: (err) =>
				this.errorLogger.logError(err, 'failed to load user record'),
		});
	}

	public createTeam(request: ICreateTeamRequest): Observable<IRecord<ITeam>> {
		return this.sneatApiService
			.post<ICreateTeamResponse>('teams/create_team', request)
			.pipe(map((response) => response.team));
	}

	public getTeam(id: string): Observable<ITeam | undefined> {
		return this.watchTeam(id)
			.pipe(
				first(),
				map(team => team || undefined),
			);
	}

	public watchTeam(id: string): Observable<ITeam | undefined> {
		console.log(`TeamService.watchTeam(${id})`);
		let subj = this.teams$[id];
		if (!subj) {
			this.teams$[id] = subj = new ReplaySubject<ITeam | undefined>(1);
		}
		return subj
			.asObservable()
			.pipe(
				tap(team => console.log('watchTeam =>', team)),
			);
	}

	public changeMemberRole(
		teamRecord: IRecord<ITeam>,
		memberId: string,
		role: MemberRole,
	): Observable<IRecord<ITeam>> {
		const member = teamRecord?.data?.members.find((m: IMemberInfo) => m.id === memberId);
		if (!member) {
			return throwError(() => 'member not found by ID in team record');
		}
		return this.sneatApiService
			.post(`team/change_member_role`, {
				team: teamRecord.id,
				member: memberId,
				role,
			})
			.pipe(
				map(() => {
					member.roles = [role];
					return teamRecord;
				}),
			);
	}

	public removeTeamMember(
		teamRecord: IRecord<ITeam>,
		memberId: string,
	): Observable<ITeam> {
		console.log(
			`removeTeamMember(teamId: ${teamRecord?.id}, memberId=${memberId})`,
		);
		if (!teamRecord) {
			return throwError(() => 'teamRecord parameters is required');
		}
		if (!teamRecord.id) {
			return throwError(() => 'teamRecord.id parameters is required');
		}
		if (!memberId) {
			return throwError(() => 'memberId is required parameter');
		}
		const updateTeam = (team?: ITeam) => {
			if (team) {
				team.members = team.members.filter((m: IMemberInfo) => m.id !== memberId);
			}
			const record: IRecord<ITeam> = { id: teamRecord.id, data: team };
			this.onTeamUpdated(record);
		};
		const processRemoveTeamMemberResponse = () =>
			this.getTeam(teamRecord.id).pipe(
				tap(updateTeam),
				// map(team => team.members.find(m => m.uid === this.userService.currentUserId) ? team : null),
			);
		const ensureTeamRecordExists = map((team?: ITeam) => {
			if (!team) {
				throw new Error('team record is expected to exist');
			}
			return team;
		});
		if (teamRecord?.data?.members) {
			const member = teamRecord.data.members.find((m: IMemberInfo) => m.id === memberId);
			if (member?.uid === this.userService.currentUserId) {
				const teamRequest: ITeamRequest = {
					team: teamRecord.id,
				};
				this.sneatApiService
					.post<ITeam>('team/leave_team', teamRequest)
					.pipe(
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

	public onTeamUpdated(team: IRecord<ITeam>): void {
		console.log(
			'TeamService.onTeamUpdated',
			team ? { id: team.id, data: { ...team.data } } : team,
		);
		let team$ = this.teams$[team.id];
		if (!team$) {
			this.teams$[team.id] = team$ = new ReplaySubject<ITeam | undefined>(1);
		}
		team$.next(team.data);
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

	public joinTeam(teamId: string, pin: number): Observable<ITeam> {
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

	public refuseToJoinTeam(teamId: string, pin: number): Observable<ITeam> {
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

	public deleteMetrics(team: string, metrics: string[]): Observable<void> {
		return this.sneatApiService.post('team/remove_metrics', {
			team,
			metrics,
		});
	}

	public addMetric(team: string, metric: ITeamMetric): Observable<void> {
		if (!team) {
			return throwError({ message: 'team parameter is required' });
		}
		const params = new HttpParams({ fromObject: { id: team } });
		return this.sneatApiService.post(
			'team/add_metric?' + params.toString(),
			{ metric },
		);
	}

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
	team: ITeam;
	invitedBy: IUserTeamInfo;
}
