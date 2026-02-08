import { HttpParams } from '@angular/common/http';
import {
	Injectable,
	Injector,
	inject,
	runInInjectionContext,
} from '@angular/core';
import {
	Firestore as AngularFirestore,
	CollectionReference,
	collection,
} from '@angular/fire/firestore';
import { SneatApiService, SneatFirestoreService } from '@sneat/api';
import {
	AuthStatus,
	AuthStatuses,
	SneatAuthStateService,
} from '@sneat/auth-core';
import { IUserSpaceBrief } from '@sneat/auth-models';
import { IIdAndBrief } from '@sneat/core';
import { IRecord } from '@sneat/data';
import { ISpaceBrief, ISpaceDbo, ISpaceMetric } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import {
	ICreateSpaceRequest,
	ICreateSpaceResponse,
	ILeaveSpaceRequest,
	ISpaceContext,
	IUpdateRelatedRequest,
	zipMapBriefsWithIDs,
} from '@sneat/space-models';
import { ISneatUserState, SneatUserService } from '@sneat/auth-core';
import {
	BehaviorSubject,
	Observable,
	Subject,
	Subscription,
	throwError,
} from 'rxjs';
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
	readonly sneatAuthStateService = inject(SneatAuthStateService);
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	private readonly afs = inject(AngularFirestore);
	private readonly userService = inject(SneatUserService);
	private readonly sneatApiService = inject(SneatApiService);

	private userID?: string;

	private currentUserSpaces?: Record<string, IUserSpaceBrief>;

	private spaces$: Record<string, BehaviorSubject<ISpaceContext | undefined>> =
		{};
	private subscriptions: Subscription[] = [];

	private readonly sfs: SneatFirestoreService<ISpaceBrief, ISpaceDbo>;

	private readonly injector = inject(Injector);

	constructor() {
		const sneatAuthStateService = this.sneatAuthStateService;

		// console.log('SpaceService.constructor()');
		this.sfs = new SneatFirestoreService<ISpaceBrief, ISpaceDbo>(
			this.injector,
			(id: string, dto: ISpaceDbo) => ({
				id,
				...dto,
			}),
		);
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
	): void => {
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
			.pipe(map((response: ICreateSpaceResponse) => response.space));
	}

	// public getSpace(ref: ISpaceRef): Observable<ISpaceContext> {
	// 	return this.watchSpace(ref).pipe(first());
	// }

	public watchSpace(id: string): Observable<ISpaceContext> {
		console.log(`SpaceService.watchSpace(id=${id})`);
		if (!id) {
			throw new Error('space id is a required parameter');
		}
		if (id === 'contacts') {
			throw new Error('watchSpace({i}d===contacts})');
		}
		let subj = this.spaces$[id];
		if (subj) {
			return subj.asObservable().pipe(filter((s) => !!s));
		}
		let spaceContext: ISpaceContext | undefined = undefined;
		if (this.currentUserSpaces) {
			const userSpaceInfo = this.currentUserSpaces[id];
			if (userSpaceInfo) {
				spaceContext = {
					id,
					type: userSpaceInfo.type,
					brief: spaceBriefFromUserSpaceInfo(userSpaceInfo),
				};
			}
		}
		subj = new BehaviorSubject<ISpaceContext | undefined>(spaceContext);
		this.spaces$[id] = subj;
		if (this.userService.currentUserID) {
			this.subscribeForSpaceChanges(id, subj);
		} else {
			this.userService.userState
				.pipe(
					filter((v) => v.status === AuthStatuses.authenticated),
					first(),
				)
				.subscribe({
					next: () => this.subscribeForSpaceChanges(id, subj),
				});
		}
		return subj.asObservable().pipe(filter((s) => !!s));
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
			this.spaces$[space.id] = team$ = new BehaviorSubject<
				ISpaceContext | undefined
			>(space);
		}
		team$.next(space);
	}

	public leaveSpace(request: ILeaveSpaceRequest): Observable<void> {
		return this.sneatApiService.post('space/leave_space', request);
	}

	public updateRelated(request: IUpdateRelatedRequest): Observable<void> {
		return this.sneatApiService.post('space/update_related', request);
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
			let space = subj.value;
			if (space && !space?.type) {
				space = {
					...space,
					type: userSpaceBrief.brief?.type,
					brief: spaceBriefFromUserSpaceInfo(userSpaceBrief.brief),
				};
				subj.next(space);
			}
			return;
		}

		const space: ISpaceContext = {
			id: userSpaceBrief.id,
			type: userSpaceBrief.brief.type,
			brief: spaceBriefFromUserSpaceInfo(userSpaceBrief.brief),
		};
		this.spaces$[space.id] = subj = new BehaviorSubject<
			ISpaceContext | undefined
		>(space);
		this.subscribeForSpaceChanges(space.id, subj);
	};

	private subscribeForSpaceChanges(
		id: string,
		subj: Subject<ISpaceContext | undefined>,
	): void {
		console.log(`SpaceService.subscribeForSpaceChanges(${id})`);
		if (id === 'contacts') {
			console.log('subscribeForSpaceChanges() => contacts');
			throw new Error('subscribeForSpaceChanges(id===contacts)');
		}
		const spacesCollection = runInInjectionContext(
			this.injector,
			() => collection(this.afs, 'spaces') as CollectionReference<ISpaceDbo>,
		);
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
