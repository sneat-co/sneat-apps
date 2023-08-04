import { Inject, Injectable, InjectionToken, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NavigationOptions } from '@ionic/angular/providers/nav-controller';
import { ILogger, TeamType } from '@sneat/core';
import { equalTeamBriefs, ITeamBrief, ITeamDto } from '@sneat/dto';
import { ILogErrorOptions } from '@sneat/logging';
import { IMemberContext, ITeamContext } from '@sneat/team/models';
import { TeamService, trackTeamIdAndTypeFromRouteParameter } from '@sneat/team/services';
import { SneatUserService } from '@sneat/auth';
import {
	distinctUntilChanged,
	MonoTypeOperatorFunction,
	Observable,
	shareReplay,
	Subject,
	Subscription,
	tap,
} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TeamComponentBaseParams } from './team-component-base-params';

@Injectable() // we need this decorator so we can implement Angular interfaces
export abstract class TeamBaseComponent implements OnDestroy {

	private readonly teamIDChanged = new Subject<string | undefined>();
	private readonly teamTypeChanged = new Subject<TeamType | undefined>();
	private readonly teamBriefChanged = new Subject<ITeamBrief | undefined | null>();
	private readonly teamDtoChanged = new Subject<ITeamDto | undefined | null>();
	private teamContext?: ITeamContext;
	protected route: ActivatedRoute;
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
	protected defaultBackPage?: string;

	public selectedMembers?: readonly IMemberContext[];

	viewMode: 'list' | 'grid' = 'grid';

	protected readonly logError: (e: unknown, message?: string, options?: ILogErrorOptions) => void;
	protected readonly logErrorHandler: (
		message?: string,
		options?: ILogErrorOptions,
	) => (error: unknown) => void;

	public readonly teamIDChanged$ = this.teamIDChanged.asObservable().pipe(
		takeUntil(this.destroyed),
		distinctUntilChanged(),
		tap(id => console.log('teamIDChanged$ => ' + id)),
	);

	public readonly teamTypeChanged$: Observable<TeamType | undefined> =
		this.teamTypeChanged.pipe(
			takeUntil(this.destroyed),
			distinctUntilChanged(),
			// tap(v => console.log('teamTypeChanged$ before replay =>', v)),
			shareReplay(1),
			// tap(v => console.log('teamTypeChanged$ after replay =>', v)),
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

	public get team(): ITeamContext | undefined { // TODO: Document why we do not allow undefined
		return this.teamContext;
	}

	public get preloader() {
		return this.teamParams.preloader;
	}

	public get teamNav() {
		return this.teamParams.teamNavService;
	}

	public get currentUserId() {
		return this.userService.currentUserID;
	}


	public get defaultBackUrl(): string {
		const t = this.teamContext;
		const url = t ? `/space/${t.type}/${t.id}` : '';
		return url && this.defaultBackPage ? url + '/' + this.defaultBackPage : url;
	}

	protected constructor(
		// we need this fake token so we can implement Angular interfaces
		@Inject(new InjectionToken('className')) public readonly className: string,
		route: ActivatedRoute,
		readonly teamParams: TeamComponentBaseParams,
	) {
		// console.log(`${className} extends TeamBasePageDirective.constructor()`);
		try {
			this.route = route;

			this.navController = teamParams.navController;
			this.teamService = teamParams.teamService;
			this.userService = teamParams.userService;
			this.logger = teamParams.loggerFactory.getLogger(this.className);
			this.logError = teamParams.errorLogger.logError;
			this.logErrorHandler = teamParams.errorLogger.logErrorHandler;

			this.getTeamContextFromRouteState();
			this.trackTeamIdFromRouteParams(route);
			this.cleanupOnUserLogout();
		} catch (e) {
			this.teamParams.errorLogger.logError(e, `Failed in (${this.logClassName}).constructor()`);
			throw e;
		}
	}

	protected get errorLogger() {
		return this.teamParams.errorLogger;
	}

	// public ionViewWillLeave(): void {
	// 	// console.log(`${this.logClassName}.ionViewWillLeave()`);
	// 	this.willLeave.next();
	// }

	public ngOnDestroy(): void {
		// console.log(`${this.logClassName}.ngOnDestroy()`);
		this.unsubscribe(`${this.logClassName}.ngOnDestroy`);
		this.destroyed.next(true);
		this.destroyed.complete();
	}

	private get logClassName(): string {
		return `${this.className} extends TeamBaseComponent`;
	}

	protected unsubscribe(reason?: string): void {
		console.log(`unsubscribe(reason: ${reason})`);
		this.subs.unsubscribe();
	}

	protected onUserIdChanged(): void {
		if (!this.currentUserId) {
			this.subs.unsubscribe();
			if (this.team && this.team.dto) {
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
		console.log(`${this.logClassName}.onTeamIdChanged()`, this.className, this.team?.id);
	}

	protected onTeamDtoChanged(): void {
		console.log(`${this.logClassName}.onTeamDtoChanged()`, this.className, this.team?.dto);
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
				// distinctUntilChanged((previous, current) => previous?.id === current?.id),
				// tap(v => console.log('trackTeamIdFromRouteParams 3', v)),
			)
			.subscribe({
				next: this.onTeamIdChangedInUrl,
				error: this.logErrorHandler,
			});
	}

	private readonly onTeamIdChangedInUrl = (team?: ITeamContext): void => {
		// console.log(`${this.logClassName}.onTeamIdChangedInUrl()`, this.teamContext?.id, ' => ', team);
		const prevTeam = this.teamContext;
		if (team === prevTeam || team?.id === prevTeam?.id && team?.type === prevTeam?.type) {
			return;
		}
		if (team && prevTeam?.id === team?.id) {
			team = { ...prevTeam, ...team };
		}
		this.setNewTeamContext(team);
	};

	private subscribeForTeamChanges(team: ITeamContext): void {
		console.log(`${this.logClassName}.subscribeForTeamChanges()`, team);
		this.teamService
			.watchTeam(team)
			.pipe(
				takeUntil(this.teamIDChanged$),
				this.takeUntilNeeded(),
			)
			.subscribe({
				next: this.onTeamContextChanged,
				error: this.errorLogger.logErrorHandler('failed to get team record'),
			});
	}

	private getTeamContextFromRouteState(): void {
		const team = history.state?.team as ITeamContext;
		if (!team?.id) {
			return;
		}
		setTimeout(() => this.setNewTeamContext(team), 1);
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
		// console.log(`${this.logClassName}.setNewTeamContext(id=${teamContext?.id}), previous id=${this.teamContext?.id}`, teamContext);
		if (!teamContext?.type && this.teamContext?.type) {
			throw new Error('!teamContext?.type && this.teamContext?.type');
		}
		if (this.teamContext == teamContext) {
			console.warn('Duplicate call to TeamPageComponent.setNewTeamContext() with same teamContext:', teamContext);
			return;
		}
		const idChanged = this.teamContext?.id != teamContext?.id;
		const teamTypeChanged = this.teamContext?.type != teamContext?.type;
		const briefChanged = equalTeamBriefs(this.teamContext?.brief, teamContext?.brief);
		const dtoChanged = this.teamContext?.dto != teamContext?.dto;
		console.log(`${this.className} extends TeamPageComponent.setNewTeamContext(id=${teamContext?.id}) => idChanged=${idChanged}, teamTypeChanged=${teamTypeChanged}, briefChanged=${briefChanged}, dtoChanged=${dtoChanged}`);
		this.teamContext = teamContext;
		if (idChanged) {
			this.teamIDChanged.next(teamContext?.id);
			this.onTeamIdChanged();
			if (teamContext) {
				setTimeout(() => this.subscribeForTeamChanges(teamContext), 1);
			}
		}
		if (teamTypeChanged && teamContext?.type) {
			// console.log('emitting teamTypeChanged$', teamContext.type);
			this.teamTypeChanged.next(teamContext.type);
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

	private readonly onTeamContextChanged = (team: ITeamContext): void => {
		const dtoChanged = team.dto !== this.teamContext?.dto;
		console.log(`${this.logClassName}.onTeamContextChanged() => dtoChanged=${dtoChanged}, team:`, team);
		if (!team.brief && team.dto) {
			team = { ...team, brief: team.dto };
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
		// console.log(`${this.logClassName} => loaded team record:`, newTeam);
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
		alert('Saving noes is not implemented yet');
	}

	protected teamPageUrl(page: string): string | undefined | null {
		return teamPageUrl(this.teamContext, page);
	}
}

export const teamPageUrl = (team?: ITeamContext, page?: string): string | undefined | null => {
	return team?.id ? page ? `/space/${team.type}/${team.id}/${page}` : `/space/${team.type}/${team.id}` : undefined;
};

