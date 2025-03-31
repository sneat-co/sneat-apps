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
import { IIdAndBrief, ISpaceRef } from '@sneat/core';
import { IRecord } from '@sneat/data';
import { ISpaceBrief, ISpaceDbo, ISpaceMetric } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	ICreateSpaceRequest,
	ICreateSpaceResponse,
	ISpaceContext,
	zipMapBriefsWithIDs,
} from '@sneat/space-models';
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
		// console.log('SpaceService.constructor()');
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
		console.log('SpaceService.processUserRecordInSpaceService()', userState);
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

	// public getSpace(ref: ISpaceRef): Observable<ISpaceContext> {
	// 	return this.watchSpace(ref).pipe(first());
	// }

	public watchSpace(ref: ISpaceRef): Observable<ISpaceContext> {
		console.log(`SpaceService.watchSpace(ref=${JSON.stringify(ref)})`);
		if (!ref) {
			throw new Error('space ref is a required parameter');
		}
		const { id } = ref;
		if (id === 'contacts') {
			throw new Error('watchSpace({i}d===contacts})');
		}
		let subj = this.spaces$[id];
		if (subj) {
			return subj.asObservable();
		}
		let spaceContext: ISpaceContext = ref;
		if (this.currentUserSpaces) {
			const userTeamInfo = this.currentUserSpaces[id];
			if (userTeamInfo) {
				spaceContext = {
					id,
					type: userTeamInfo.type,
					brief: spaceBriefFromUserSpaceInfo(userTeamInfo),
				};
			}
		}
		subj = new BehaviorSubject<ISpaceContext>(spaceContext);
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

	public onSpaceUpdated(space: ISpaceContext): void {
		console.log(
			'SpaceService.onSpaceUpdated',
			space ? { id: space.id, dto: { ...space.dbo } } : space,
		);
		let team$ = this.spaces$[space.id];
		if (team$) {
			const prevTeam = team$.value;
			space = { ...prevTeam, ...space };
		} else {
			this.spaces$[space.id] = team$ = new BehaviorSubject<ISpaceContext>(
				space,
			);
		}
		team$.next(space);
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
		userSpaceBrief: IIdAndBrief<IUserSpaceBrief>,
	): void => {
		console.log(
			'subscribeForUserSpaceChanges() => userSpaceBrief:',
			userSpaceBrief,
		);
		let subj = this.spaces$[userSpaceBrief.id];
		if (subj) {
			let team = subj.value;
			if (!team.type) {
				team = {
					...team,
					type: userSpaceBrief.brief?.type,
					brief: spaceBriefFromUserSpaceInfo(userSpaceBrief.brief),
				};
				subj.next(team);
			}
			return;
		}

		const space: ISpaceContext = {
			id: userSpaceBrief.id,
			type: userSpaceBrief.brief.type,
			brief: spaceBriefFromUserSpaceInfo(userSpaceBrief.brief),
		};
		this.spaces$[userSpaceBrief.id] = subj = new BehaviorSubject<ISpaceContext>(
			space,
		);
		this.subscribeForSpaceChanges(subj);
	};

	private subscribeForSpaceChanges(subj: BehaviorSubject<ISpaceContext>): void {
		const t = subj.value;
		console.log(`SpaceService.subscribeForSpaceChanges(${t.id})`);
		const { id } = t;
		if (id === 'contacts') {
			console.log('subscribeForSpaceChanges() => contacts');
			throw new Error('subscribeForSpaceChanges(id===contacts)');
		}
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
				tap((space) => {
					console.log(
						'SpaceService.subscribeForSpaceChanges() => New space from Firestore:',
						space,
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
		console.log(`SpaceService.unsubscribe(on=${on})`);
		try {
			this.subscriptions.forEach((s) => s.unsubscribe());
			this.subscriptions = [];
			this.spaces$ = {};
			console.log('unsubscribed => teams$:', this.spaces$);
		} catch (e) {
			this.errorLogger.logError(e, 'SpaceService failed to unsubscribe');
		}
	}
}
