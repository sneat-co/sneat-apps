import { HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import {
	Firestore as AngularFirestore,
	collection,
	CollectionReference,
} from '@angular/fire/firestore';
import { SneatApiService, SneatFirestoreService } from '@sneat/api';
import {
	AuthStatus,
	AuthStatuses,
	SneatAuthStateService,
} from '@sneat/auth-core';
import { IUserSpaceBrief } from '@sneat/auth-models';
import { IJoinSpaceInfoResponse } from '@sneat/contactus-core';
import { IIdAndBrief } from '@sneat/core';
import { IRecord } from '@sneat/data';
import { ISpaceBrief, ISpaceDbo, ISpaceMetric } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	ICreateSpaceRequest,
	ICreateSpaceResponse,
	ISpaceContext,
	ISpaceRef,
	zipMapBriefsWithIDs,
} from '@sneat/team-models';
import { ISneatUserState, SneatUserService } from '@sneat/auth-core';
import { BehaviorSubject, Observable, Subscription, throwError } from 'rxjs';
import { filter, first, map, tap } from 'rxjs/operators';

const teamBriefFromUserTeamInfo = (v: IUserSpaceBrief): ISpaceBrief => ({
	...v,
	type: v.type,
});

// export class CachedDataService<Brief, Dbo extends Brief> {
// 	constructor(
// 		private readonly db: AngularFirestore,
// 	) {
// 	}
//
// 	// watchRecord()
// }

@Injectable()
export class TeamService {
	private userID?: string;

	private currentUserTeams?: Record<string, IUserSpaceBrief>;

	private teams$: Record<string, BehaviorSubject<ISpaceContext>> = {};
	private subscriptions: Subscription[] = [];

	private readonly sfs: SneatFirestoreService<ISpaceBrief, ISpaceDbo>;

	constructor(
		readonly sneatAuthStateService: SneatAuthStateService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly afs: AngularFirestore,
		private readonly userService: SneatUserService,
		private readonly sneatApiService: SneatApiService,
	) {
		// console.log('TeamService.constructor()');
		this.sfs = new SneatFirestoreService<ISpaceBrief, ISpaceDbo>((id, dto) => ({
			id,
			...dto,
		}));
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

	private readonly processUserRecordInTeamService = (
		userState: ISneatUserState,
	) => {
		console.log('TeamService.processUserRecordInTeamService()', userState);
		const user = userState?.record;
		if (!user) {
			// this.userID = undefined;
			if (
				userState.status === AuthStatuses.notAuthenticated &&
				this.subscriptions?.length
			) {
				this.unsubscribe(
					'user is not authenticated and active team subscriptions',
				);
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

		zipMapBriefsWithIDs(user.teams).forEach(this.subscribeForUserTeamChanges);
	};

	public createTeam(
		request: ICreateSpaceRequest,
	): Observable<IRecord<ISpaceDbo>> {
		return this.sneatApiService
			.post<ICreateSpaceResponse>('teams/create_team', request)
			.pipe(map((response) => response.space));
	}

	// public getTeam(ref: ITeamRef): Observable<ITeamContext> {
	// 	return this.watchTeam(ref).pipe(first());
	// }

	public watchTeam(ref: ISpaceRef): Observable<ISpaceContext> {
		console.log(`TeamService.watchTeam(ref=${JSON.stringify(ref)})`);
		if (!ref) {
			throw new Error('team ref is a required parameter');
		}
		const { id } = ref;
		let subj = this.teams$[id];
		if (subj) {
			return subj.asObservable();
		}
		let teamContext: ISpaceContext = ref;
		if (this.currentUserTeams) {
			const userTeamInfo = this.currentUserTeams[id];
			if (userTeamInfo) {
				teamContext = {
					id,
					type: userTeamInfo.type,
					brief: teamBriefFromUserTeamInfo(userTeamInfo),
				};
			}
		}
		subj = new BehaviorSubject<ISpaceContext>(teamContext);
		this.teams$[id] = subj;
		if (this.userService.currentUserID) {
			this.subscribeForTeamChanges(subj);
		} else {
			this.userService.userState
				.pipe(
					filter((v) => v.status === AuthStatuses.authenticated),
					first(),
				)
				.subscribe({
					next: () => this.subscribeForTeamChanges(subj),
				});
		}
		return subj.asObservable();
	}

	public onTeamUpdated(team: ISpaceContext): void {
		console.log(
			'TeamService.onTeamUpdated',
			team ? { id: team.id, dto: { ...team.dbo } } : team,
		);
		let team$ = this.teams$[team.id];
		if (team$) {
			const prevTeam = team$.value;
			team = { ...prevTeam, ...team };
		} else {
			this.teams$[team.id] = team$ = new BehaviorSubject<ISpaceContext>(team);
		}
		team$.next(team);
	}

	public getTeamJoinInfo(
		inviteID: string,
		pin: string,
	): Observable<IJoinSpaceInfoResponse> {
		return this.sneatApiService
			.postAsAnonymous<IJoinSpaceInfoResponse>('team/join_info', {
				inviteID,
				pin,
			})
			.pipe(
				map((response) => ({
					...response,
					invite: {
						...response.invite,
						id: inviteID,
						pin,
					},
				})),
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
	public addMetric(team: string, metric: ISpaceMetric): Observable<void> {
		if (!team) {
			return throwError(() => 'team parameter is required');
		}
		const params = new HttpParams({ fromObject: { id: team } });
		return this.sneatApiService.post('team/add_metric?' + params.toString(), {
			metric,
		});
	}

	private readonly subscribeForUserTeamChanges = (
		userTeamInfo: IIdAndBrief<IUserSpaceBrief>,
	): void => {
		console.log('subscribeForFirestoreTeamChanges', userTeamInfo);
		let subj = this.teams$[userTeamInfo.id];
		if (subj) {
			let team = subj.value;
			if (!team.type) {
				team = {
					...team,
					type: userTeamInfo.brief?.type,
					brief: teamBriefFromUserTeamInfo(userTeamInfo.brief),
				};
				subj.next(team);
			}
			return;
		}

		const team: ISpaceContext = {
			id: userTeamInfo.id,
			type: userTeamInfo.brief.type,
			brief: teamBriefFromUserTeamInfo(userTeamInfo.brief),
		};
		this.teams$[userTeamInfo.id] = subj = new BehaviorSubject<ISpaceContext>(
			team,
		);
		this.subscribeForTeamChanges(subj);
	};

	private subscribeForTeamChanges(subj: BehaviorSubject<ISpaceContext>): void {
		const t = subj.value;
		console.log(`TeamService.subscribeForTeamChanges(${t.id})`);
		const { id } = t;
		const teamsCollection = collection(
			this.afs,
			'spaces',
		) as CollectionReference<ISpaceDbo>;
		const o: Observable<ISpaceContext> = this.sfs
			.watchByID(teamsCollection, id)
			.pipe(
				map((team) => {
					const prevTeam = this.teams$[id].value;
					console.log('prevTeam', prevTeam);
					// if (prevTeam.assets) {
					// 	team = { ...team, assets: prevTeam.assets};
					// 	console.log('Reusing assets from prev context');
					// }
					return team;
				}),
				tap((team) => {
					console.log(
						'TeamService.subscribeForTeamChanges() => New team from Firestore:',
						team,
					);
					// subj.next(team);
				}),
			);

		this.subscriptions.push(
			o.subscribe({
				next: (v) => subj.next(v), // Do not use as "next: subj.next" because it will be called with wrong "this" context
				error: this.errorLogger.logErrorHandler(
					`Failed to watch team with ID="${id}"`,
				),
			}),
		);
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
