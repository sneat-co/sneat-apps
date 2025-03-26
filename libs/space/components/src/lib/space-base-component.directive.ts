import {
	computed,
	Directive,
	inject,
	Inject,
	OnInit,
	signal,
} from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NavigationOptions } from '@ionic/angular/common/providers/nav-controller';
import { ILogger, SpaceType } from '@sneat/core';
import { equalSpaceBriefs, ISpaceBrief, ISpaceDbo } from '@sneat/dto';
import { ISpaceContext } from '@sneat/space-models';
import {
	SpaceService,
	trackSpaceIdAndTypeFromRouteParameter,
} from '@sneat/space-services';
import { SneatUserService } from '@sneat/auth-core';
import { ClassName, SneatBaseComponent } from '@sneat/ui';
import { distinctUntilChanged, Observable, shareReplay, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SpaceComponentBaseParams } from './space-component-base-params.service';

@Directive() // The @Directive is required by Angular as we are implementing OnInit
export abstract class SpaceBaseComponent
	extends SneatBaseComponent
	implements OnInit
{
	protected readonly $space = signal<ISpaceContext | undefined>(undefined);
	protected readonly $spaceID = computed(() => this.$space()?.id);

	protected readonly spaceIDChanged = new Subject<string | undefined>();
	protected readonly spaceTypeChanged = new Subject<SpaceType | undefined>();

	protected noPermissions = false;

	protected readonly spaceBriefChanged = new Subject<
		ISpaceBrief | undefined | null
	>();
	protected readonly spaceDboChanged = new Subject<
		ISpaceDbo | undefined | null
	>();

	// protected spaceContext?: ISpaceContext;

	private readonly spaceChanged = new Subject<ISpaceContext>();
	protected readonly spaceChanged$ = this.spaceChanged
		.asObservable()
		.pipe(this.takeUntilDestroyed());

	protected readonly navController: NavController;
	// protected readonly activeCommuneService: IActiveCommuneService;
	protected readonly userService: SneatUserService;
	// protected readonly communeService: ICommuneService;
	protected readonly spaceService: SpaceService;
	// protected readonly authStateService: IAuthStateService;
	protected readonly logger: ILogger;
	// protected readonly willLeave = new Subject<void>();
	protected defaultBackPage?: string;

	protected readonly spaceIDChanged$ = this.spaceIDChanged.asObservable().pipe(
		this.takeUntilDestroyed(),
		distinctUntilChanged(),
		// tap((id) => console.log(this.className + '=> spaceIDChanged$: ' + id)),
	);

	protected readonly spaceTypeChanged$: Observable<SpaceType | undefined> =
		this.spaceTypeChanged.pipe(
			this.takeUntilDestroyed(),
			distinctUntilChanged(),
			// tap(v => console.log('spaceTypeChanged$ before replay =>', v)),
			shareReplay(1),
			// tap(v => console.log('spaceTypeChanged$ after replay =>', v)),
		);

	protected readonly spaceBriefChanged$ = this.spaceBriefChanged
		.asObservable()
		.pipe(this.takeUntilDestroyed(), distinctUntilChanged(equalSpaceBriefs));

	public readonly spaceDboChanged$ = this.spaceDboChanged
		.asObservable()
		.pipe(this.takeUntilDestroyed(), distinctUntilChanged());

	protected get space(): ISpaceContext {
		// TODO: Document why we do not allow undefined
		return this.$space() || ({ id: '' } as ISpaceContext);
	}

	protected get preloader() {
		return this.spaceParams.preloader;
	}

	protected get spaceNav() {
		return this.spaceParams.spaceNavService;
	}

	protected get currentUserId() {
		return this.userService.currentUserID;
	}

	protected get defaultBackUrl(): string {
		const space = this.$space();
		const url = space ? `/space/${space.type}/${space.id}` : '';
		return url && this.defaultBackPage ? url + '/' + this.defaultBackPage : url;
	}

	protected readonly route = inject(ActivatedRoute);
	protected readonly spaceParams = inject(SpaceComponentBaseParams);

	protected constructor(@Inject(ClassName) className: string) {
		super(className);
		const spaceParams = this.spaceParams;
		// console.log(`${className} extends TeamBasePageDirective.constructor()`);
		try {
			this.navController = spaceParams.navController;
			this.spaceService = spaceParams.spaceService;
			this.userService = spaceParams.userService;
			this.logger = spaceParams.loggerFactory.getLogger(this.className);
			this.getSpaceContextFromRouteState();
			this.cleanupOnUserLogout();
		} catch (e) {
			this.errorLogger.logError(
				e,
				`Failed in ${this.className}:SpaceBaseComponent.constructor()`,
			);
			throw e;
		}
	}

	public ngOnInit(): void {
		// We can't call this in constructor as some members of the child class may not be initialized yet
		this.trackRouteParamMap(
			this.route.paramMap.pipe(this.takeUntilDestroyed()),
		);
	}

	// public ionViewWillLeave(): void {
	// 	// console.log(`${this.className}:SpaceBaseComponent.ionViewWillLeave()`);
	// 	this.willLeave.next();
	// }

	protected onUserIdChanged(): void {
		console.log();
		if (!this.currentUserId) {
			this.subs.unsubscribe();
			if (this.space && this.space.dbo) {
				this.setNewSpaceContext({
					...this.space,
					brief: undefined,
					dbo: undefined,
				});
			}
		}
	}

	protected navigateForwardToSpacePage(
		page: string,
		navOptions?: NavigationOptions,
	) {
		if (!this.space) {
			return Promise.reject('no space context');
		}
		return this.spaceParams.spaceNavService.navigateForwardToSpacePage(
			this.space,
			page,
			navOptions,
		);
	}

	protected onSpaceIdChanged(): void {
		this.console.log(
			`${this.className}:SpaceBaseComponent.onSpaceIdChanged() spaceID=${this.space?.id}`,
		);
	}

	protected onSpaceDboChanged(): void {
		// this.console.log(
		// 	`${this.className}:SpaceBaseComponent.onSpaceDboChanged(): ` +
		// 		JSON.stringify(this.space.dbo),
		// );
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars,@typescript-eslint/no-empty-function
	protected onRouteParamsChanged(params: ParamMap): void {}

	protected trackRouteParamMap(paramMap$: Observable<ParamMap>): void {
		this.trackSpaceIdFromRouteParams(paramMap$);
		paramMap$.subscribe({
			next: (paramMap) => this.onRouteParamsChanged(paramMap),
		});
	}

	private trackSpaceIdFromRouteParams(paramMap$: Observable<ParamMap>): void {
		trackSpaceIdAndTypeFromRouteParameter(paramMap$)
			// .pipe(
			// 	tap((v) => console.log('trackSpaceIdFromRouteParams 1', v)),
			// 	distinctUntilChanged(
			// 		(previous, current) => previous?.id === current?.id,
			// 	),
			// 	tap((v) => console.log('trackSpaceIdFromRouteParams 3', v)),
			// )
			.subscribe({
				next: this.onSpaceIdChangedInUrl,
				error: this.logErrorHandler,
			});
	}

	private readonly onSpaceIdChangedInUrl = (space?: ISpaceContext): void => {
		const prevSpace = this.$space();
		// console.log(
		// 	`${this.className}:SpaceBaseComponent.onSpaceIdChangedInUrl()`,
		// 	prevSpace?.id,
		// 	' => ',
		// 	space,
		// );
		if (
			space === prevSpace ||
			(space?.id === prevSpace?.id && space?.type === prevSpace?.type)
		) {
			return;
		}
		if (space && prevSpace?.id === space?.id) {
			space = { ...prevSpace, ...space };
		}
		this.setNewSpaceContext(space);
	};

	private subscribeForSpaceChanges(space: ISpaceContext): void {
		this.console.log(
			`${this.className}:SpaceBaseComponent.subscribeForSpaceChanges()`,
			space,
		);
		this.spaceService
			.watchSpace(space)
			.pipe(takeUntil(this.spaceIDChanged$), this.takeUntilDestroyed())
			.subscribe({
				next: this.onSpaceContextChanged,
				error: (err) => {
					if (err.code === 'permission-denied') {
						console.log(
							'subscribeForSpaceChanges() => permission denied to read space record',
						);
						this.noPermissions = true;
						return;
					}
					this.errorLogger.logError('failed to get team record');
				},
			});
	}

	private getSpaceContextFromRouteState(): void {
		const space = history.state?.team as ISpaceContext;
		this.console.log(
			`${this.className}:SpaceBaseComponent.getSpaceContextFromRouteState()`,
			space,
		);
		if (!space?.id) {
			return;
		}
		// TODO: document why not to set team context immediately
		setTimeout(() => this.setNewSpaceContext(space), 1);
	}

	private cleanupOnUserLogout(): void {
		try {
			this.userService.userChanged.pipe(this.takeUntilDestroyed()).subscribe({
				next: (uid) => {
					if (!uid) {
						this.unsubscribe('user signed out');
						this.$space.set(undefined);
					}
					this.onUserIdChanged();
				},
				error: (e) => this.logError(e, 'Failed to get user record'),
			});
		} catch (e) {
			this.logError(
				e,
				'Failed to subscribe a hook on page cleanup on user logout',
			);
		}
	}

	// private updateExistingSpaceContext(spaceContext: ISpaceContext): void {
	// 	const dtoChanged = this.spaceContext?.dto != spaceContext.dto;
	// 	this.spaceContext = spaceContext;
	// 	if (dtoChanged) {
	// 		this.onSpaceDtoChanged();
	// 	}
	// }

	private setNewSpaceContext(spaceContext?: ISpaceContext): void {
		this.console.log(
			`${this.className}:SpaceBaseComponent.setNewSpaceContext(id=${spaceContext?.id}), previous id=${this.$space()?.id}`,
			spaceContext,
		);
		const prevSpace = this.$space();
		if (!spaceContext?.type && prevSpace?.type) {
			throw new Error('!spaceContext?.type && this.spaceContext?.type');
		}
		if (prevSpace == spaceContext) {
			console.warn(
				'Duplicate call to SpaceBaseComponent.setNewSpaceContext() with same spaceContext:',
				spaceContext,
			);
			// return;
		}
		const idChanged = prevSpace?.id != spaceContext?.id;
		const spaceTypeChanged = prevSpace?.type != spaceContext?.type;
		const briefChanged = equalSpaceBriefs(
			prevSpace?.brief,
			spaceContext?.brief,
		);
		const dboChanged = prevSpace?.dbo != spaceContext?.dbo;
		this.console.log(
			`${this.className}:SpaceBaseComponent.setNewSpaceContext(id=${spaceContext?.id}) => idChanged=${idChanged}, spaceTypeChanged=${spaceTypeChanged}, briefChanged=${briefChanged}, dtoChanged=${dboChanged}`,
		);
		this.$space.set(spaceContext);
		if (idChanged) {
			this.spaceIDChanged.next(spaceContext?.id);
			this.onSpaceIdChanged();
			if (spaceContext) {
				setTimeout(() => this.subscribeForSpaceChanges(spaceContext), 1);
				// setTimeout(() => this.subscribeForContactusSpaceChanges(spaceContext), 1);
				// }
			}
			if (spaceTypeChanged && spaceContext?.type) {
				// console.log('emitting spaceTypeChanged$', spaceContext.type);
				this.spaceTypeChanged.next(spaceContext.type);
			}
			if (briefChanged) {
				this.spaceBriefChanged.next(spaceContext?.brief);
			}
			if (dboChanged) {
				this.spaceDboChanged.next(spaceContext?.dbo);
			}
			if (!spaceContext) {
				this.unsubscribe('no team context');
				return;
			}
			const { id } = spaceContext;
			if (!id) {
				this.logError(
					'setNewSpaceContext() is called with team context without ID',
				);
				return;
			}
			// this.subs.add(
			// 	this.userService.userChanged
			// 		.pipe(
			// 			first(), // TODO: Cancel if user signed out
			// 			mergeMap(() => {
			// 				return this.teamService.watchTeam(id).pipe(
			// 					this.takeUntilNeeded(),
			// 				);
			// 			}),
			// 			tap(newTeam => {
			// 				if (newTeam && spaceContext.type && spaceContext.type != newTeam.type) {
			// 					throw new Error(`loaded space=${id} with type=${newSpace.type} while expected to have type=${spaceContext.type}`);
			// 				}
			// 			}),
			// 		)
			// 		.subscribe({
			// 			next: this.onSpaceLoaded,
			// 			error: this.logErrorHandler(`failed to load space by id=${id}`),
			// 		}),
			// );
			if (spaceContext) {
				this.spaceChanged.next(spaceContext);
			}
		}

		// private setSpaceContext = (spaceContext?: ISpaceContext | null): void => {
		// 	console.log('setSpaceContext()', spaceContext);
		// 	try {
		// 		if (spaceContext?.id) {
		// 			if (this.spaceContext?.id !== spaceContext.id) {
		// 				this.setNewSpaceContext(spaceContext);
		// 			} else {
		// 				this.updateExistingSpaceContext(spaceContext);
		// 			}
		// 		} else if (this.spaceContext) {
		// 			const hadData = !!this.spaceContext.dto;
		// 			const hadId = !!this.spaceContext.id;
		// 			this.spaceContext = undefined;
		// 			if (hadId) {
		// 				this.onSpaceIdChanged();
		// 			}
		// 			if (hadData) {
		// 				this.onSpaceDtoChanged();
		// 			}
		// 		}
		//
		// 	} catch (e) {
		// 		this.logError(e, 'Failed to set space id');
		// 	}
	}

	private readonly onSpaceContextChanged = (space: ISpaceContext): void => {
		const dtoChanged = space.dbo !== this.$space()?.dbo;
		// this.console.log(
		// 	`${this.className}:SpaceBaseComponent.onSpaceContextChanged() => dtoChanged=${dtoChanged}, space:`,
		// 	space,
		// );
		if (!space.brief && space.dbo) {
			space = { ...space, brief: space.dbo };
		}
		if (!space.type) {
			if (space.brief?.type) {
				space = { ...space, type: space.brief.type };
			}
		}
		this.setNewSpaceContext(space);
		this.$space.set(space);
		if (dtoChanged) {
			this.onSpaceDboChanged();
		}
		// this.console.log(`${this.className} => loaded team record:`, newTeam);
		// if (newSpace.id === this.spaceContext?.id) {
		// 	this.setNewSpaceContext({ ...this.spaceContext, ...newSpace });
		// 	// this.spaceContext = ;
		// } else { // Whe should never end up here as should unsubscribe on leaving page or ID change
		// 	this.errorLogger.logError(`got team record after space context changed: received id=${newSpace.id}, current id=${this.spaceContext?.id}`);
		// }
	};

	protected saveNotes(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		// alert('Saving noes is not implemented yet');
	}

	protected spacePageUrl(page: string): string {
		return spacePageUrl(this.$space(), page) || '';
	}
}

export const spacePageUrl = (
	team?: ISpaceContext,
	page?: string,
): string | undefined => {
	return team?.id
		? page
			? `/space/${team.type}/${team.id}/${page}`
			: `/space/${team.type}/${team.id}`
		: undefined;
};
