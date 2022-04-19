import { Inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NavigationOptions } from '@ionic/angular/providers/nav-controller';
import { equalTeamBriefs, ITeamBrief, ITeamDto, TeamType } from '@sneat/dto';
import { ILogErrorOptions } from '@sneat/logging';
import { ILogger } from '@sneat/rxstore';
import { ITeamContext } from '@sneat/team/models';
import { TeamService, trackTeamIdAndTypeFromRouteParameter } from '@sneat/team/services';
import { SneatUserService } from '@sneat/user';
import { distinctUntilChanged, MonoTypeOperatorFunction, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TeamComponentBaseParams } from './team-component-base-params';

@Injectable() // we need this decorator so we can implement Angular interfaces
export abstract class TeamBaseComponent implements OnDestroy {

	private readonly teamIDChanged = new Subject<string | undefined>();
	private readonly teamTypeChanged = new Subject<TeamType | undefined>();
	private readonly teamBriefChanged = new Subject<ITeamBrief | undefined | null>();
	private readonly teamDtoChanged = new Subject<ITeamDto | undefined | null>();
	private teamContext?: ITeamContext;
	private teamRecordSubscription?: Subscription;
	protected route?: ActivatedRoute;
	protected readonly navController: NavController;
	// protected readonly activeCommuneService: IActiveCommuneService;
	protected readonly userService: SneatUserService;
	// protected readonly communeService: ICommuneService;
	protected readonly teamService: TeamService;
	// protected readonly authStateService: IAuthStateService;
	protected readonly logger: ILogger;
	protected readonly subs = new Subscription();
	protected readonly destroyed = new Subject<boolean>();
	// protected readonly willLeave = new Subject<void>();
	protected readonly logError: (e: any, message?: string, options?: ILogErrorOptions) => void;
	protected readonly logErrorHandler: (
		message?: string,
		options?: ILogErrorOptions,
	) => (error: any) => void;

	public readonly teamIDChanged$ = this.teamIDChanged.asObservable().pipe(
		takeUntil(this.destroyed),
		distinctUntilChanged(),
	);

	public readonly teamTypeChanged$ = this.teamTypeChanged.asObservable().pipe(
		takeUntil(this.destroyed),
		distinctUntilChanged(),
	);

	public readonly teamBriefChanged$ = this.teamBriefChanged.asObservable()
		.pipe(
			takeUntil(this.destroyed),
			distinctUntilChanged(equalTeamBriefs),
		);

	public readonly teamDtoChanged$ = this.teamDtoChanged.asObservable()
		.pipe(
			takeUntil(this.destroyed),
			distinctUntilChanged(),
		);

	public get team(): ITeamContext | undefined {
		return this.teamContext;
	}

	public get preloader() {
		return this.teamParams.preloader;
	}

	public get teamNav() {
		return this.teamParams.teamNavService;
	}

	public get currentUserId() {
		return this.userService.currentUserId;
	}

	public get defaultBackUrl(): string {
		const t = this.teamContext;
		return t ? `/space/${t.type}/${t.id}` : '';
	}

	protected constructor(
		@Inject(new InjectionToken('className')) // we need this fake token so we can implement Angular interfaces
		public readonly className: string,
		route: ActivatedRoute,
		readonly teamParams: TeamComponentBaseParams,
	) {
		console.log(`${className} extends TeamBasePageDirective.constructor(), history.state:`, history.state);
		this.route = route;

		this.navController = teamParams.navController;
		this.teamService = teamParams.teamService;
		this.userService = teamParams.userService;
		this.logger = teamParams.loggerFactory.getLogger(this.className);
		this.logError = teamParams.errorLogger.logError;
		this.logErrorHandler = teamParams.errorLogger.logErrorHandler;

		try {
			this.getTeamContextFromRouteState();
			this.trackTeamIdFromRouteParams(route);
			this.cleanupOnUserLogout();
		} catch (e) {
			this.logError(e, 'Failed in TeamBasePage.constructor()');
		}
	}

	protected get errorLogger() {
		return this.teamParams.errorLogger;
	}

	// public ionViewWillLeave(): void {
	// 	// console.log(`${this.className} extends TeamBasePage.ionViewWillLeave()`);
	// 	this.willLeave.next();
	// }

	public ngOnDestroy(): void {
		console.log(`${this.className} extends TeamBasePage.ngOnDestroy()`);
		this.unsubscribe(`${this.className} extends TeamBasePage.ngOnDestroy`);
		this.destroyed.next(true);
		this.destroyed.complete();
	}

	protected unsubscribe(reason: string): void {
		console.log(`unsubscribe(reason: ${reason})`);
		this.subs.unsubscribe();
	}

	protected onUserIdChanged(): void {
		if (!this.currentUserId) {
			this.subs.unsubscribe();
			if (this.team) {
				// TODO: What if it is a public team? Should we keep dto or hide brief as well?
				this.setNewTeamContext({ ...this.team, dto: undefined });
			}
		}
	}

	protected navigateForwardToTeamPage(page: string, navOptions?: NavigationOptions) {
		if (!this.team) {
			return Promise.reject('no team context');
		}
		return this.teamParams.teamNavService.navigateForwardToTeamPage(this.team, page, navOptions);
	}

	protected onTeamIdChanged(): void {
		console.log('TeamBasePage.onTeamIdChanged()', this.className);
	}

	protected onTeamDtoChanged(): void {
		console.log(`${this.className} extends TeamBasePage.onTeamDtoChanged()`, this.className, this.team?.dto);
	}

	protected takeUntilNeeded<T>(): MonoTypeOperatorFunction<T> {
		return takeUntil(this.destroyed);
	}

	private trackTeamIdFromRouteParams(route: ActivatedRoute): void {
		trackTeamIdAndTypeFromRouteParameter(route)
			.pipe(
				// tap(v => console.log('trackTeamIdFromRouteParams 1', v)),
				this.takeUntilNeeded(),
				// tap(v => console.log('trackTeamIdFromRouteParams 2', v)),
				distinctUntilChanged((previous, current) => previous?.id === current?.id),
				// tap(v => console.log('trackTeamIdFromRouteParams 3', v)),
			)
			.subscribe({
				next: this.onTeamIdChangedInUrl,
				error: this.logErrorHandler,
			});
	}

	private onTeamIdChangedInUrl = (team?: ITeamContext): void => {
		console.log(`${this.className} extends TeamPageComponent.onTeamIdChangedInUrl()`, this.teamContext?.id, ' => ', team);
		if (this.teamRecordSubscription) {
			this.teamRecordSubscription.unsubscribe();
			this.teamRecordSubscription = undefined;
		}
		const prevTeam = this.teamContext;
		console.log('prevTeam:', prevTeam);
		if (team && prevTeam?.id === team?.id) {
			team = { ...prevTeam, ...team };
			return;
		}
		this.setNewTeamContext(team);
		if (!team) {
			return;
		}
		this.subscribeForTeamChanges(team);
	};

	private subscribeForTeamChanges(team: ITeamContext): void {
		console.log(`${this.className} extends TeamPageComponent.subscribeForTeamChanges()`, team);
		this.teamRecordSubscription = this.teamService
			.watchTeam(team.id)
			.pipe(
				this.takeUntilNeeded(),
			)
			.subscribe({
				next: this.onTeamLoaded,
				error: this.errorLogger.logError,
			});
	}

	private getTeamContextFromRouteState(): void {
		const team = history.state?.team as ITeamContext;
		if (!team?.id) {
			return;
		}
		this.setNewTeamContext(team);
	}

	private cleanupOnUserLogout(): void {
		try {
			this.userService.userChanged
				.pipe(
					this.takeUntilNeeded(),
				)
				.subscribe({
					next: (uid) => {
						if (!uid) {
							this.unsubscribe('user signed out');
							this.teamContext = undefined;
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

	private setNewTeamContext(teamContext?: ITeamContext): void {
		console.log(`${this.className} extends TeamPageComponent.setNewTeamContext(id=${teamContext?.id}), previous id=${this.teamContext?.id}`, teamContext);
		if (this.teamContext == teamContext) {
			return;
		}
		const idChanged = this.teamContext?.id != teamContext?.id;
		const teamTypeChange = this.teamContext?.type != teamContext?.type;
		const briefChanged = equalTeamBriefs(this.teamContext?.brief, teamContext?.brief);
		const dtoChanged = this.teamContext?.dto != teamContext?.dto;
		console.log(`${this.className} extends TeamPageComponent.setNewTeamContext(id=${teamContext?.id}) => idChanged=${idChanged}, briefChanged=${briefChanged}, dtoChanged=${dtoChanged}`);
		this.teamContext = teamContext;
		if (idChanged) {
			this.teamIDChanged.next(teamContext?.id);
		}
		if (teamTypeChange) {
			this.teamTypeChanged.next(teamContext?.type);
		}
		if (briefChanged) {
			this.teamBriefChanged.next(teamContext?.brief);
		}
		if (dtoChanged) {
			this.teamDtoChanged.next(teamContext?.dto);
		}
		if (!teamContext) {
			this.unsubscribe('no team context');
			return;
		}
		const { id } = teamContext;
		if (!id) {
			this.logError('setNewTeamContext() is called with team context without ID');
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
	// };

	private readonly onTeamLoaded = (team: ITeamContext): void => {
		const dtoChanged = team.dto !== this.teamContext?.dto;
		console.log(`${this.className} extends TeamBasePage.onTeamLoaded() => dtoChanged=${dtoChanged}, team:`, team);
		if (!team.brief && team.dto) {
			team = { ...team, brief: { id: team.id, ...team.dto } };
		}
		if (!team.type) {
			if (team.brief?.type) {
				team = { ...team, type: team.brief.type };
			}
		}
		this.setNewTeamContext(team);
		this.teamContext = team;
		if (dtoChanged) {
			this.onTeamDtoChanged();
		}
		// console.log(`${this.className} extends TeamBaseComponent => loaded team record:`, newTeam);
		// if (newTeam.id === this.teamContext?.id) {
		// 	this.setNewTeamContext({ ...this.teamContext, ...newTeam });
		// 	// this.teamContext = ;
		// } else { // Whe should never end up here as should unsubscribe on leaving page or ID change
		// 	this.errorLogger.logError(`got team record after team context changed: received id=${newTeam.id}, current id=${this.teamContext?.id}`);
		// }
	};
}

