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

const spaceBriefFromUserSpaceInfo = (v: IUserSpaceBrief): ISpaceBrief => ({
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
export class SpaceService {
	private userID?: string;

	private currentUserSpaces?: Record<string, IUserSpaceBrief>;

	private spaces$: Record<string, BehaviorSubject<ISpaceContext>> = {};
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
			next: this.processUserRecordInSpaceService,
			error: this.errorLogger.logErrorHandler('failed to load user record'),
		});
	}

	private readonly processUserRecordInSpaceService = (
		userState: ISneatUserState,
	) => {
		console.log('TeamService.processUserRecordInSpaceService()', userState);
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
		this.currentUserSpaces = user?.spaces;

		zipMapBriefsWithIDs(user.spaces).forEach(this.subscribeForUserSpaceChanges);
	};

	public createSpace(
		request: ICreateSpaceRequest,
	): Observable<IRecord<ISpaceDbo>> {
		return this.sneatApiService
			.post<ICreateSpaceResponse>('spaces/create_space', request)
			.pipe(map((response) => response.space));
	}

	// public getTeam(ref: ITeamRef): Observable<ITeamContext> {
	// 	return this.watchTeam(ref).pipe(first());
	// }

	public watchSpace(ref: ISpaceRef): Observable<ISpaceContext> {
		console.log(`TeamService.watchTeam(ref=${JSON.stringify(ref)})`);
		if (!ref) {
			throw new Error('team ref is a required parameter');
		}
		const { id } = ref;
		let subj = this.spaces$[id];
		if (subj) {
			return subj.asObservable();
		}
		let teamContext: ISpaceContext = ref;
		if (this.currentUserSpaces) {
			const userTeamInfo = this.currentUserSpaces[id];
			if (userTeamInfo) {
				teamContext = {
					id,
					type: userTeamInfo.type,
					brief: spaceBriefFromUserSpaceInfo(userTeamInfo),
				};
			}
		}
		subj = new BehaviorSubject<ISpaceContext>(teamContext);
		this.spaces$[id] = subj;
		if (this.userService.currentUserID) {
			this.subscribeForSpaceChanges(subj);
		} else {
			this.userService.userState
				.pipe(
					filter((v) => v.status === AuthStatuses.authenticated),
					first(),
				)
				.subscribe({
					next: () => this.subscribeForSpaceChanges(subj),
				});
		}
		return subj.asObservable();
	}

	public onSpaceUpdated(team: ISpaceContext): void {
		console.log(
			'TeamService.onSpaceUpdated',
			team ? { id: team.id, dto: { ...team.dbo } } : team,
		);
		let team$ = this.spaces$[team.id];
		if (team$) {
			const prevTeam = team$.value;
			team = { ...prevTeam, ...team };
		} else {
			this.spaces$[team.id] = team$ = new BehaviorSubject<ISpaceContext>(team);
		}
		team$.next(team);
	}

	public getSpaceJoinInfo(
		inviteID: string,
		pin: string,
	): Observable<IJoinSpaceInfoResponse> {
		return this.sneatApiService
			.postAsAnonymous<IJoinSpaceInfoResponse>('space/join_info', {
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
	public deleteMetrics(space: string, metrics: string[]): Observable<void> {
		return this.sneatApiService.post('space/remove_metrics', {
			space,
			metrics,
		});
	}

	// TODO: move to separate module
	public addMetric(space: string, metric: ISpaceMetric): Observable<void> {
		if (!space) {
			return throwError(() => 'space parameter is required');
		}
		const params = new HttpParams({ fromObject: { id: space } });
		return this.sneatApiService.post('space/add_metric?' + params.toString(), {
			metric,
		});
	}

	private readonly subscribeForUserSpaceChanges = (
		userTeamInfo: IIdAndBrief<IUserSpaceBrief>,
	): void => {
		console.log('subscribeForFirestoreTeamChanges', userTeamInfo);
		let subj = this.spaces$[userTeamInfo.id];
		if (subj) {
			let team = subj.value;
			if (!team.type) {
				team = {
					...team,
					type: userTeamInfo.brief?.type,
					brief: spaceBriefFromUserSpaceInfo(userTeamInfo.brief),
				};
				subj.next(team);
			}
			return;
		}

		const space: ISpaceContext = {
			id: userTeamInfo.id,
			type: userTeamInfo.brief.type,
			brief: spaceBriefFromUserSpaceInfo(userTeamInfo.brief),
		};
		this.spaces$[userTeamInfo.id] = subj = new BehaviorSubject<ISpaceContext>(
			space,
		);
		this.subscribeForSpaceChanges(subj);
	};

	private subscribeForSpaceChanges(subj: BehaviorSubject<ISpaceContext>): void {
		const t = subj.value;
		console.log(`TeamService.subscribeForTeamChanges(${t.id})`);
		const { id } = t;
		const spacesCollection = collection(
			this.afs,
			'spaces',
		) as CollectionReference<ISpaceDbo>;
		const o: Observable<ISpaceContext> = this.sfs
			.watchByID(spacesCollection, id)
			.pipe(
				map((team) => {
					const prevTeam = this.spaces$[id].value;
					console.log('prevTeam', prevTeam);
					// if (prevTeam.assets) {
					// 	team = { ...team, assets: prevTeam.assets};
					// 	console.log('Reusing assets from prev context');
					// }
					return team;
				}),
				tap((team) => {
					console.log(
						'TeamService.subscribeForSpaceChanges() => New team from Firestore:',
						team,
					);
					// subj.next(team);
				}),
			);

		this.subscriptions.push(
			o.subscribe({
				next: (v) => subj.next(v), // Do not use as "next: subj.next" because it will be called with wrong "this" context
				error: (err) => subj.error(err),
			}),
		);
	}

	private unsubscribe(on: string): void {
		console.log(`TeamService.unsubscribe(on=${on})`);
		try {
			this.subscriptions.forEach((s) => s.unsubscribe());
			this.subscriptions = [];
			this.spaces$ = {};
			console.log('unsubscribed => teams$:', this.spaces$);
		} catch (e) {
			this.errorLogger.logError(e, 'TeamService failed to unsubscribe');
		}
	}
}
