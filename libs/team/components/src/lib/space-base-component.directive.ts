import { Directive, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NavigationOptions } from '@ionic/angular/common/providers/nav-controller';
import { ILogger, SpaceType } from '@sneat/core';
import { equalSpaceBriefs, ISpaceBrief, ISpaceDbo } from '@sneat/dto';
import { ILogErrorOptions } from '@sneat/logging';
import { ISpaceContext } from '@sneat/team-models';
import {
	SpaceService,
	trackSpaceIdAndTypeFromRouteParameter,
} from '@sneat/team-services';
import { SneatUserService } from '@sneat/auth-core';
import { SneatBaseComponent } from '@sneat/ui';
import {
	distinctUntilChanged,
	MonoTypeOperatorFunction,
	Observable,
	shareReplay,
	Subject,
	tap,
} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SpaceComponentBaseParams } from './space-component-base-params.service';

// @Component({
// 	selector: 'sneat-team-base-component',
// 	standalone: true,
// 	template: '',
// }) // we need this decorator so we can implement Angular interfaces
@Directive() /* abstract */
export class SpaceBaseComponent extends SneatBaseComponent implements OnInit {
	protected readonly spaceIDChanged = new Subject<string | undefined>();
	protected readonly spaceTypeChanged = new Subject<SpaceType | undefined>();

	protected noPermissions = false;

	protected readonly spaceBriefChanged = new Subject<
		ISpaceBrief | undefined | null
	>();
	protected readonly spaceDboChanged = new Subject<
		ISpaceDbo | undefined | null
	>();
	protected spaceContext?: ISpaceContext; // TODO: check - is it duplication of team?

	protected readonly navController: NavController;
	// protected readonly activeCommuneService: IActiveCommuneService;
	protected readonly userService: SneatUserService;
	// protected readonly communeService: ICommuneService;
	protected readonly spaceService: SpaceService;
	// protected readonly authStateService: IAuthStateService;
	protected readonly logger: ILogger;
	// protected readonly willLeave = new Subject<void>();
	protected defaultBackPage?: string;

	protected readonly logError: (
		e: unknown,
		message?: string,
		options?: ILogErrorOptions,
	) => void;
	protected readonly logErrorHandler: (
		message?: string,
		options?: ILogErrorOptions,
	) => (error: unknown) => void;

	public readonly spaceIDChanged$ = this.spaceIDChanged.asObservable().pipe(
		takeUntil(this.destroyed$),
		distinctUntilChanged(),
		tap((id) => console.log(this.className + '=> teamIDChanged$: ' + id)),
	);

	public readonly spaceTypeChanged$: Observable<SpaceType | undefined> =
		this.spaceTypeChanged.pipe(
			takeUntil(this.destroyed$),
			distinctUntilChanged(),
			// tap(v => console.log('teamTypeChanged$ before replay =>', v)),
			shareReplay(1),
			// tap(v => console.log('teamTypeChanged$ after replay =>', v)),
		);

	public readonly spaceBriefChanged$ = this.spaceBriefChanged
		.asObservable()
		.pipe(takeUntil(this.destroyed$), distinctUntilChanged(equalSpaceBriefs));

	public readonly spaceDboChanged$ = this.spaceDboChanged
		.asObservable()
		.pipe(takeUntil(this.destroyed$), distinctUntilChanged());

	public get space(): ISpaceContext {
		// TODO: Document why we do not allow undefined
		return this.spaceContext || ({ id: '' } as ISpaceContext);
	}

	public get preloader() {
		return this.spaceParams.preloader;
	}

	public get spaceNav() {
		return this.spaceParams.spaceNavService;
	}

	public get currentUserId() {
		return this.userService.currentUserID;
	}

	public get defaultBackUrl(): string {
		const t = this.spaceContext;
		const url = t ? `/space/${t.type}/${t.id}` : '';
		return url && this.defaultBackPage ? url + '/' + this.defaultBackPage : url;
	}

	protected constructor(
		// we need this fake token so we can implement Angular interfaces
		className: string,
		protected readonly route: ActivatedRoute,
		protected readonly spaceParams: SpaceComponentBaseParams,
	) {
		super(className, spaceParams.errorLogger);
		// console.log(`${className} extends TeamBasePageDirective.constructor()`);
		this.logError = spaceParams.errorLogger.logError;
		this.logErrorHandler = spaceParams.errorLogger.logErrorHandler;
		try {
			this.route = route;

			this.navController = spaceParams.navController;
			this.spaceService = spaceParams.spaceService;
			this.userService = spaceParams.userService;
			this.logger = spaceParams.loggerFactory.getLogger(this.className);
			this.getSpaceContextFromRouteState();
			this.cleanupOnUserLogout();
		} catch (e) {
			this.errorLogger.logError(
				e,
				`Failed in ${this.className}:TeamBaseComponent.constructor()`,
			);
			throw e;
		}
	}

	public ngOnInit(): void {
		// We can't call this in constructor as some members of the child class may not be initialized yet
		this.trackRouteParamMap(this.route.paramMap.pipe(this.takeUntilNeeded()));
	}

	// public ionViewWillLeave(): void {
	// 	// console.log(`${this.className}.ionViewWillLeave()`);
	// 	this.willLeave.next();
	// }

	protected onUserIdChanged(): void {
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
			return Promise.reject('no team context');
		}
		return this.spaceParams.spaceNavService.navigateForwardToSpacePage(
			this.space,
			page,
			navOptions,
		);
	}

	protected onSpaceIdChanged(): void {
		this.console.log(
			`${this.className}: TeamBaseComponent.onTeamIdChanged()`,
			this.className,
			this.space?.id,
		);
	}

	protected onSpaceDboChanged(): void {
		this.console.log(
			`${this.className}.onSpaceDboChanged()`,
			this.className,
			this.space?.dbo,
		);
	}

	protected takeUntilNeeded<T>(): MonoTypeOperatorFunction<T> {
		return takeUntil(this.destroyed$);
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
			// // tap(v => console.log('trackSpaceIdFromRouteParams 1', v)),
			// // distinctUntilChanged((previous, current) => previous?.id === current?.id),
			// // tap(v => console.log('trackSpaceIdFromRouteParams 3', v)),
			// )
			.subscribe({
				next: this.onSpaceIdChangedInUrl,
				error: this.logErrorHandler,
			});
	}

	private readonly onSpaceIdChangedInUrl = (team?: ISpaceContext): void => {
		// console.log(`${this.className}.onSpaceIdChangedInUrl()`, this.teamContext?.id, ' => ', team);
		const prevTeam = this.spaceContext;
		if (
			team === prevTeam ||
			(team?.id === prevTeam?.id && team?.type === prevTeam?.type)
		) {
			return;
		}
		if (team && prevTeam?.id === team?.id) {
			team = { ...prevTeam, ...team };
		}
		this.setNewSpaceContext(team);
	};

	private subscribeForSpaceChanges(space: ISpaceContext): void {
		this.console.log(`${this.className}.subscribeForSpaceChanges()`, space);
		this.spaceService
			.watchSpace(space)
			.pipe(takeUntil(this.spaceIDChanged$), this.takeUntilNeeded())
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
		this.console.log(`${this.className}.getTeamContextFromRouteState()`, space);
		if (!space?.id) {
			return;
		}
		// TODO: document why not to set team context immediately
		setTimeout(() => this.setNewSpaceContext(space), 1);
	}

	private cleanupOnUserLogout(): void {
		try {
			this.userService.userChanged.pipe(this.takeUntilNeeded()).subscribe({
				next: (uid) => {
					if (!uid) {
						this.unsubscribe('user signed out');
						this.spaceContext = undefined;
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

	// private updateExistingTeamContext(teamContext: ITeamContext): void {
	// 	const dtoChanged = this.teamContext?.dto != teamContext.dto;
	// 	this.teamContext = teamContext;
	// 	if (dtoChanged) {
	// 		this.onTeamDtoChanged();
	// 	}
	// }

	private setNewSpaceContext(spaceContext?: ISpaceContext): void {
		this.console.log(
			`${this.className}.setNewTeamContext(id=${spaceContext?.id}), previous id=${this.spaceContext?.id}`,
			spaceContext,
		);
		if (!spaceContext?.type && this.spaceContext?.type) {
			throw new Error('!teamContext?.type && this.teamContext?.type');
		}
		if (this.spaceContext == spaceContext) {
			console.warn(
				'Duplicate call to TeamPageComponent.setNewTeamContext() with same teamContext:',
				spaceContext,
			);
			return;
		}
		const idChanged = this.spaceContext?.id != spaceContext?.id;
		const spaceTypeChanged = this.spaceContext?.type != spaceContext?.type;
		const briefChanged = equalSpaceBriefs(
			this.spaceContext?.brief,
			spaceContext?.brief,
		);
		const dboChanged = this.spaceContext?.dbo != spaceContext?.dbo;
		this.console.log(
			`${this.className} extends TeamPageComponent.setNewTeamContext(id=${spaceContext?.id}) => idChanged=${idChanged}, teamTypeChanged=${spaceTypeChanged}, briefChanged=${briefChanged}, dtoChanged=${dboChanged}`,
		);
		this.spaceContext = spaceContext;
		if (idChanged) {
			this.spaceIDChanged.next(spaceContext?.id);
			this.onSpaceIdChanged();
			if (spaceContext) {
				setTimeout(() => this.subscribeForSpaceChanges(spaceContext), 1);
				// setTimeout(() => this.subscribeForContactusTeamChanges(teamContext), 1);
				// }
			}
			if (spaceTypeChanged && spaceContext?.type) {
				// console.log('emitting teamTypeChanged$', teamContext.type);
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
					'setNewTeamContext() is called with team context without ID',
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
			// 				if (newTeam && teamContext.type && teamContext.type != newTeam.type) {
			// 					throw new Error(`loaded team=${id} with type=${newTeam.type} while expected to have type=${teamContext.type}`);
			// 				}
			// 			}),
			// 		)
			// 		.subscribe({
			// 			next: this.onTeamLoaded,
			// 			error: this.logErrorHandler(`failed to load team by id=${id}`),
			// 		}),
			// );
		}

		// private setTeamContext = (teamContext?: ITeamContext | null): void => {
		// 	console.log('setTeamContext()', teamContext);
		// 	try {
		// 		if (teamContext?.id) {
		// 			if (this.teamContext?.id !== teamContext.id) {
		// 				this.setNewTeamContext(teamContext);
		// 			} else {
		// 				this.updateExistingTeamContext(teamContext);
		// 			}
		// 		} else if (this.teamContext) {
		// 			const hadData = !!this.teamContext.dto;
		// 			const hadId = !!this.teamContext.id;
		// 			this.teamContext = undefined;
		// 			if (hadId) {
		// 				this.onTeamIdChanged();
		// 			}
		// 			if (hadData) {
		// 				this.onTeamDtoChanged();
		// 			}
		// 		}
		//
		// 	} catch (e) {
		// 		this.logError(e, 'Failed to set team id');
		// 	}
	}

	private readonly onSpaceContextChanged = (team: ISpaceContext): void => {
		const dtoChanged = team.dbo !== this.spaceContext?.dbo;
		this.console.log(
			`${this.className}.onTeamContextChanged() => dtoChanged=${dtoChanged}, team:`,
			team,
		);
		if (!team.brief && team.dbo) {
			team = { ...team, brief: team.dbo };
		}
		if (!team.type) {
			if (team.brief?.type) {
				team = { ...team, type: team.brief.type };
			}
		}
		this.setNewSpaceContext(team);
		this.spaceContext = team;
		if (dtoChanged) {
			this.onSpaceDboChanged();
		}
		// this.console.log(`${this.className} => loaded team record:`, newTeam);
		// if (newTeam.id === this.teamContext?.id) {
		// 	this.setNewTeamContext({ ...this.teamContext, ...newTeam });
		// 	// this.teamContext = ;
		// } else { // Whe should never end up here as should unsubscribe on leaving page or ID change
		// 	this.errorLogger.logError(`got team record after team context changed: received id=${newTeam.id}, current id=${this.teamContext?.id}`);
		// }
	};

	protected saveNotes(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		// alert('Saving noes is not implemented yet');
	}

	protected spacePageUrl(page: string): string {
		return spacePageUrl(this.spaceContext, page) || '';
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
