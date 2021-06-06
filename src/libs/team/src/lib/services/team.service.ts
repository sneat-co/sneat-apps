import {Observable, ReplaySubject, Subscription, throwError} from 'rxjs';
import {AngularFirestore} from '@angular/fire/firestore';
import {filter, first, map, mergeMap, tap} from 'rxjs/operators';

import {AngularFireAuth} from '@angular/fire/auth';
import {Inject, Injectable} from '@angular/core';
import {HttpParams} from '@angular/common/http';
import firebase from 'firebase';
import {ErrorLogger, IErrorLogger} from '@sneat/logging';
import User = firebase.User;
import {SneatTeamApiService} from '@sneat/api';
import {SneatUserService} from '@sneat/auth';
import {ICreateTeamRequest, ICreateTeamResponse} from '../dto-models';
import {IRecord} from '@sneat/data';
import {IUserRecord, IUserTeamInfo, IUserTeamInfoWithId} from '@sneat/auth-models';
import {ITeam, ITeamMemberRequest, ITeamMetric, ITeamRequest, MemberRole} from "../models";

@Injectable()
export class TeamService {
	private userId: string;

	private teams$: { [id: string]: ReplaySubject<ITeam> } = {};
	private subscriptions: Subscription[] = [];

	constructor(
		readonly afAuth: AngularFireAuth,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly db: AngularFirestore,
		private readonly userService: SneatUserService,
		private readonly sneatTeamApiService: SneatTeamApiService,
	) {
		const onFirebaseAuthStateChanged = (user: User): void => {
			if (!user) {
				this.unsubscribe('sign out');
			}
		};
		afAuth.authState.subscribe(onFirebaseAuthStateChanged);

		const processUserRecordInTeamService = (user: IRecord<IUserRecord>): void => {
			console.log('processUserRecordInTeamService()');
			if (!user) {
				// this.userId = undefined;
				if (this.subscriptions?.length) {
					this.unsubscribe('user record is empty');
				}
				return;
			}
			if (user.id !== this.userId) {
				if (this.userId) {
					this.unsubscribe('user id changed');
				}
				this.userId = user.id;
			}
			if (user.data?.teams) {
				const subscribeForFirestoreTeamChanges = (teamInfo: IUserTeamInfoWithId): void => {
					const {id} = teamInfo;
					let subj = this.teams$[id];
					console.log('subscribeForFirestoreTeamChanges, subj:', subj);
					if (!subj) {
						this.teams$[id] = subj = new ReplaySubject<ITeam>();
					}
					const o = this.db
						.collection('teams')
						.doc<ITeam>(id)
						.snapshotChanges()
						.pipe(
							filter(documentSnapshot => documentSnapshot.type === 'value'),
							map(documentSnapshot => documentSnapshot.payload),
							map(teamDoc => teamDoc.exists ? teamDoc.data() as ITeam : undefined),
							tap(team => {
								console.log('New team record from Firestore:', team);
							})
						);
					this.subscriptions.push(o.subscribe(subj));
				};
				Object.entries(user.data.teams).forEach(
					([id, team]) => subscribeForFirestoreTeamChanges({id, ...(team as IUserTeamInfoWithId)}),
				);
			}
		};
		// We are intentionally not un-subscribing from user record updates. TODO: why?
		this.userService.userRecord.subscribe({
			next: processUserRecordInTeamService,
			error: err => this.errorLogger.logError(err, 'failed to load user record'),
		});
	}

	public createTeam(request: ICreateTeamRequest): Observable<IRecord<ITeam>> {
		return this.sneatTeamApiService.post<ICreateTeamResponse>('teams/create_team', request)
			.pipe(
				map(response => response.team),
			);
	}

	public getTeam(id: string): Observable<ITeam> {
		return this.watchTeam(id).pipe(first());
	}

	public watchTeam(id: string): Observable<ITeam> {
		console.log(`TeamService.watchTeam(${id})`);
		let subj = this.teams$[id];
		if (!subj) {
			this.teams$[id] = subj = new ReplaySubject<ITeam>();
		}
		return subj.asObservable().pipe(
			tap(team => console.log('watchTeam =>', team))
		);
	}

	public changeMemberRole(teamRecord: IRecord<ITeam>, memberId: string, role: MemberRole): Observable<IRecord<ITeam>> {
		const member = teamRecord.data.members.find(m => m.id === memberId);
		return this.sneatTeamApiService.post(`team/change_member_role`, {
			team: teamRecord.id,
			member: memberId,
			role,
		}).pipe(
			map(() => {
				member.roles = [role];
				return teamRecord;
			}),
		)
	}

	public removeTeamMember(
		teamRecord: IRecord<ITeam>,
		memberId: string,
	): Observable<ITeam> {
		console.log(`removeTeamMember(teamId: ${teamRecord?.id}, memberId=${memberId})`);
		if (!teamRecord) {
			return throwError('teamRecord parameters is required');
		}
		if (!teamRecord.id) {
			return throwError('teamRecord.id parameters is required');
		}
		if (!memberId) {
			return throwError('memberId is required parameter');
		}
		const updateTeam = (team: ITeam) => {
			team.members = team.members.filter(m => m.id !== memberId);
			this.onTeamUpdated({id: teamRecord.id, data: team});
		};
		const processRemoveTeamMemberResponse = () => this.getTeam(teamRecord.id).pipe(
			tap(updateTeam),
			map(team =>
				team.members.find(m => m.uid === this.userService.currentUserId) ? team : null
			),
		);
		if (teamRecord.data.members) {
			const member = teamRecord.data.members.find(m => m.id === memberId);
			if (member?.uid === this.userService.currentUserId) {
				const teamRequest: ITeamRequest = {
					team: teamRecord.id,
				};
				return this.sneatTeamApiService.post('team/leave_team', teamRequest).pipe(
					mergeMap(processRemoveTeamMemberResponse),
				);
			}
		}
		const request: ITeamMemberRequest = {
			team: teamRecord.id,
			member: memberId,
		};
		return this.sneatTeamApiService.post('team/remove_member', request).pipe(
			mergeMap(processRemoveTeamMemberResponse),
		);
	}

	public onTeamUpdated(team: IRecord<ITeam>): void {
		console.log('TeamService.onTeamUpdated', team ? {id: team.id, data: {...team.data}} : team);
		let team$ = this.teams$[team.id];
		if (!team$) {
			this.teams$[team.id] = team$ = new ReplaySubject<ITeam>();
		}
		team$.next(team.data);
	}

	public getTeamJoinInfo(teamId: string, pin: number): Observable<IJoinTeamInfoResponse> {
		return this.sneatTeamApiService.getAsAnonymous('team/join_info', new HttpParams({
			fromObject: {
				id: teamId,
				pin: pin.toString()
			}
		}));
	}

	public joinTeam(teamId: string, pin: number): Observable<ITeam> {
		const params = new HttpParams({
			fromObject: {
				id: teamId,
				pin: pin.toString()
			}
		});
		return this.sneatTeamApiService.post('team/join_team?' + params.toString(), null);
	}

	public refuseToJoinTeam(teamId: string, pin: number): Observable<ITeam> {
		const params = new HttpParams({
			fromObject: {
				id: teamId,
				pin: pin.toString()
			}
		});
		return this.sneatTeamApiService.post('team/refuse_to_join_team?' + params.toString(), null);
	}

	public deleteMetrics(team: string, metrics: string[]): Observable<void> {
		return this.sneatTeamApiService.post('team/remove_metrics', {team, metrics})
	}

	public addMetric(team: string, metric: ITeamMetric): Observable<void> {
		if (!team) {
			return throwError({message: 'team parameter is required'});
		}
		const params = new HttpParams({fromObject: {id: team}});
		return this.sneatTeamApiService.post('team/add_metric?' + params.toString(), {metric})
	}

	private unsubscribe(on: string): void {
		console.log('TeamService: unsubscribe on ' + on);
		try {
			this.subscriptions.forEach(s => s.unsubscribe());
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
