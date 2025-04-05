import {
	computed,
	Directive,
	effect,
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
import {
	distinctUntilChanged,
	map,
	MonoTypeOperatorFunction,
	Observable,
	shareReplay,
	Subject,
} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SpaceComponentBaseParams } from './space-component-base-params.service';

@Directive() // The @Directive is required by Angular as we are implementing OnInit
export abstract class SpaceBaseComponent
	extends SneatBaseComponent
	implements OnInit
{
	protected readonly $space = signal<ISpaceContext>({ id: '' });
	protected readonly $spaceID = computed(() => this.$space()?.id);
	protected readonly $spaceType = computed(() => this.$space()?.type);

	private readonly spaceIDChanged = new Subject<string | undefined>();
	private readonly spaceTypeChanged = new Subject<SpaceType | undefined>();

	protected takeUntilSpaceIdChanged<T>(): MonoTypeOperatorFunction<T> {
		return takeUntil(this.spaceIDChanged$);
	}

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

	protected readonly navController = inject(NavController);
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

	protected readonly $defaultBackUrlSpacePath = signal('');

	// Intentionally not readonly, but might reconsider
	protected $defaultBackUrl = computed<string>(() => {
		const space = this.$space();
		const path = this.$defaultBackUrlSpacePath();
		let url = space ? `/space/${space.type}/${space.id}` : '';
		url = url && this.defaultBackPage ? url + '/' + this.defaultBackPage : url;
		if (path) {
			url = url + '/' + path;
		}
		return url;
	});

	protected readonly route = inject(ActivatedRoute);
	protected readonly spaceParams = inject(SpaceComponentBaseParams);

	protected constructor(@Inject(ClassName) className: string) {
		super(className);
		console.log(`${className}.SpaceBaseComponent.constructor()`);

		this.spaceIDChanged$
			.pipe(this.takeUntilDestroyed())
			.subscribe((spaceID) => {
				if (spaceID) {
					this.onSpaceIdChanged();

					// !!! Be careful to migrate this to signal effect - can cause dead cycles!
					setTimeout(() => this.subscribeForSpaceChanges(), 1);
				}
			});

		effect(() => {
			this.spaceTypeChanged.next(this.$spaceType());
		});

		try {
			// this.navController = spaceParams.navController;
			this.spaceService = this.spaceParams.spaceService;
			this.userService = this.spaceParams.userService;
			this.logger = this.spaceParams.loggerFactory.getLogger(this.className);
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
		if (!this.currentUserId) {
			this.subs.unsubscribe();
			if (this.space && this.space.dbo) {
				this.setSpaceContext({
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
		this.log(
			`${this.className}:SpaceBaseComponent.onSpaceIdChanged() spaceID=${this.space?.id}`,
		);
	}

	protected onSpaceDboChanged(): void {
		// this.log(
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
			// 	tap((v) => this.log('trackSpaceIdFromRouteParams 1', v)),
			// 	distinctUntilChanged(
			// 		(previous, current) => previous?.id === current?.id,
			// 	),
			// 	tap((v) => this.log('trackSpaceIdFromRouteParams 3', v)),
			// )
			.subscribe({
				next: this.onSpaceIdChangedInUrl,
				error: this.logErrorHandler,
			});
	}

	private readonly onSpaceIdChangedInUrl = (space?: ISpaceContext): void => {
		const prevSpace = this.$space();
		this.log(
			`${this.className}:SpaceBaseComponent.onSpaceIdChangedInUrl(): prevSpace.id: ${prevSpace?.id} => ${space?.id}`,
		);
		if (
			space === prevSpace ||
			(space?.id === prevSpace?.id && space?.type === prevSpace?.type)
		) {
			return;
		}
		if (space && prevSpace?.id === space?.id) {
			space = { ...prevSpace, ...space };
		}
		this.setSpaceContext(space);
	};

	private subscribeForSpaceChanges(): void {
		this.spaceService
			.watchSpace(this.$spaceID())
			.pipe(
				this.takeUntilDestroyed(),
				takeUntil(this.spaceIDChanged$),
				map((space) => ({ ...space, type: space.dbo?.type })),
			)
			.subscribe({
				next: this.onSpaceContextChanged,
				error: (err) => {
					if (err.code === 'permission-denied') {
						this.log(
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
		this.log(
			`${this.className}:SpaceBaseComponent.getSpaceContextFromRouteState()`,
			space,
		);
		if (!space?.id) {
			return;
		}
		// TODO: document why not to set team context immediately
		setTimeout(() => this.setSpaceContext(space), 1);
	}

	private cleanupOnUserLogout(): void {
		try {
			this.userService.userChanged.pipe(this.takeUntilDestroyed()).subscribe({
				next: (uid) => {
					if (!uid) {
						this.unsubscribe('user signed out');
						this.setSpaceContext(undefined);
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

	private setSpaceContext(spaceContext?: ISpaceContext): void {
		this.log(
			`${this.className}:SpaceBaseComponent.setNewSpaceContext(id=${spaceContext?.id}), previous id=${this.$space()?.id}`,
			spaceContext,
		);
		const prevSpace = this.$space();
		if (prevSpace == spaceContext) {
			this.console.warn(
				'Duplicate call to SpaceBaseComponent.setNewSpaceContext() with same spaceContext:',
				spaceContext,
			);
			return;
		}
		if (!spaceContext?.type && prevSpace.type) {
			this.console.error(
				'!spaceContext?.type && prevSpace.type',
				'prevSpace:',
				prevSpace,
				'newSpace:',
				spaceContext,
			);
			return;
		}
		const idChanged = prevSpace?.id != spaceContext?.id;
		const briefChanged = equalSpaceBriefs(
			prevSpace?.brief,
			spaceContext?.brief,
		);
		const dboChanged = prevSpace?.dbo != spaceContext?.dbo;
		this.log(
			`${this.className}:SpaceBaseComponent.setNewSpaceContext(id=${spaceContext?.id}) => idChanged=${idChanged}, briefChanged=${briefChanged}, dtoChanged=${dboChanged}`,
		);
		this.$space.set(spaceContext || { id: '' });
		if (briefChanged) {
			this.spaceBriefChanged.next(spaceContext?.brief);
		}
		if (dboChanged) {
			this.spaceDboChanged.next(spaceContext?.dbo);
		}
		if (idChanged) {
			if (!spaceContext) {
				this.unsubscribe('no space context');
				return;
			}
			if (spaceContext) {
				this.spaceChanged.next(spaceContext);
			}
		}
	}

	private readonly onSpaceContextChanged = (space: ISpaceContext): void => {
		const dtoChanged = space.dbo !== this.$space()?.dbo;
		// this.log(
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
		this.setSpaceContext(space);
		if (dtoChanged) {
			this.onSpaceDboChanged();
		}
		// this.log(`${this.className} => loaded team record:`, newTeam);
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
