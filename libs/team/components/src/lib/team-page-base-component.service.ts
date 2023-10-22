import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { NavigationOptions } from '@ionic/angular/common/providers/nav-controller';
import { ILogger, TeamType } from '@sneat/core';
import { equalTeamBriefs, ITeamBrief, ITeamDto } from '@sneat/dto';
import { ILogErrorOptions } from '@sneat/logging';
import { ContactService } from '@sneat/contactus-services';
import {
	IContactusTeamDtoAndID,
	IMemberContext,
	ITeamContext,
} from '@sneat/team/models';
import {
	TeamService,
	trackTeamIdAndTypeFromRouteParameter,
} from '@sneat/team/services';
import { SneatUserService } from '@sneat/auth-core';
import { SneatPageBaseComponent } from '@sneat/ui';
import {
	distinctUntilChanged,
	MonoTypeOperatorFunction,
	Observable,
	shareReplay,
	Subject,
	tap,
} from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TeamComponentBaseParams } from './team-component-base-params';

@Injectable() // we need this decorator so we can implement Angular interfaces
export abstract class TeamPageBaseComponent extends SneatPageBaseComponent {
	private readonly teamIDChanged = new Subject<string | undefined>();
	private readonly teamTypeChanged = new Subject<TeamType | undefined>();
	private readonly teamBriefChanged = new Subject<
		ITeamBrief | undefined | null
	>();
	private readonly teamDtoChanged = new Subject<ITeamDto | undefined | null>();
	private teamContext?: ITeamContext; // TODO: check - is it duplication of team?

	protected contactusTeam?: IContactusTeamDtoAndID;

	protected route: ActivatedRoute;
	protected readonly navController: NavController;
	// protected readonly activeCommuneService: IActiveCommuneService;
	protected readonly userService: SneatUserService;
	// protected readonly communeService: ICommuneService;
	protected readonly teamService: TeamService;
	protected readonly contactService: ContactService;
	// protected readonly authStateService: IAuthStateService;
	protected readonly logger: ILogger;
	// protected readonly willLeave = new Subject<void>();
	protected defaultBackPage?: string;

	public selectedMembers?: readonly IMemberContext[];

	viewMode: 'list' | 'grid' = 'grid';

	protected readonly logError: (
		e: unknown,
		message?: string,
		options?: ILogErrorOptions,
	) => void;
	protected readonly logErrorHandler: (
		message?: string,
		options?: ILogErrorOptions,
	) => (error: unknown) => void;

	public readonly teamIDChanged$ = this.teamIDChanged.asObservable().pipe(
		takeUntil(this.destroyed),
		distinctUntilChanged(),
		tap((id) => console.log(this.className + '=> teamIDChanged$: ' + id)),
	);

	public readonly teamTypeChanged$: Observable<TeamType | undefined> =
		this.teamTypeChanged.pipe(
			takeUntil(this.destroyed),
			distinctUntilChanged(),
			// tap(v => console.log('teamTypeChanged$ before replay =>', v)),
			shareReplay(1),
			// tap(v => console.log('teamTypeChanged$ after replay =>', v)),
		);

	public readonly teamBriefChanged$ = this.teamBriefChanged
		.asObservable()
		.pipe(takeUntil(this.destroyed), distinctUntilChanged(equalTeamBriefs));

	public readonly teamDtoChanged$ = this.teamDtoChanged
		.asObservable()
		.pipe(takeUntil(this.destroyed), distinctUntilChanged());

	public get team(): ITeamContext {
		// TODO: Document why we do not allow undefined
		return this.teamContext || ({ id: '' } as ITeamContext);
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
		className: string,
		route: ActivatedRoute,
		readonly teamParams: TeamComponentBaseParams,
	) {
		super(className, teamParams.errorLogger);
		// console.log(`${className} extends TeamBasePageDirective.constructor()`);
		try {
			this.route = route;

			this.navController = teamParams.navController;
			this.teamService = teamParams.teamService;
			this.contactService = teamParams.contactService;
			this.userService = teamParams.userService;
			this.logger = teamParams.loggerFactory.getLogger(this.className);
			this.logError = teamParams.errorLogger.logError;
			this.logErrorHandler = teamParams.errorLogger.logErrorHandler;

			this.getTeamContextFromRouteState();
			this.trackTeamIdFromRouteParams(route);
			this.cleanupOnUserLogout();
		} catch (e) {
			this.teamParams.errorLogger.logError(
				e,
				`Failed in (${this.className}).constructor()`,
			);
			throw e;
		}
	}

	// public ionViewWillLeave(): void {
	// 	// console.log(`${this.className}.ionViewWillLeave()`);
	// 	this.willLeave.next();
	// }

	protected onUserIdChanged(): void {
		if (!this.currentUserId) {
			this.subs.unsubscribe();
			if (this.team && this.team.dto) {
				// TODO: What if it is a public team? Should we keep dto or hide brief as well?
				this.setNewTeamContext({ ...this.team, dto: undefined });
			}
		}
	}

	protected navigateForwardToTeamPage(
		page: string,
		navOptions?: NavigationOptions,
	) {
		if (!this.team) {
			return Promise.reject('no team context');
		}
		return this.teamParams.teamNavService.navigateForwardToTeamPage(
			this.team,
			page,
			navOptions,
		);
	}

	protected onTeamIdChanged(): void {
		console.log(
			`${this.className}.onTeamIdChanged()`,
			this.className,
			this.team?.id,
		);
	}

	protected onTeamDtoChanged(): void {
		console.log(
			`${this.className}.onTeamDtoChanged()`,
			this.className,
			this.team?.dto,
		);
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
		// console.log(`${this.className}.onTeamIdChangedInUrl()`, this.teamContext?.id, ' => ', team);
		const prevTeam = this.teamContext;
		if (
			team === prevTeam ||
			(team?.id === prevTeam?.id && team?.type === prevTeam?.type)
		) {
			return;
		}
		if (team && prevTeam?.id === team?.id) {
			team = { ...prevTeam, ...team };
		}
		this.setNewTeamContext(team);
	};

	private subscribeForTeamChanges(team: ITeamContext): void {
		console.log(`${this.className}.subscribeForTeamChanges()`, team);
		this.teamService
			.watchTeam(team)
			.pipe(takeUntil(this.teamIDChanged$), this.takeUntilNeeded())
			.subscribe({
				next: this.onTeamContextChanged,
				error: this.errorLogger.logErrorHandler('failed to get team record'),
			});
	}

	private subscribeForContactusTeamChanges(team: ITeamContext): void {
		this.teamParams.contactusTeamService
			.watchTeamModuleRecord(team)
			.pipe(takeUntil(this.teamIDChanged$), this.takeUntilNeeded())
			.subscribe({
				next: (o) => this.onContactusTeamChanged(o),
				error: this.errorLogger.logErrorHandler('failed to get team record'),
			});
	}

	protected onContactusTeamChanged(
		contactusTeam: IContactusTeamDtoAndID,
	): void {
		console.log(`${this.className}.onContactusTeamChanged()`, contactusTeam);
		this.contactusTeam = contactusTeam;
	}

	private getTeamContextFromRouteState(): void {
		const team = history.state?.team as ITeamContext;
		console.log(`${this.className}.getTeamContextFromRouteState()`, team);
		if (!team?.id) {
			return;
		}
		// TODO: document why not to set team context immediately
		setTimeout(() => this.setNewTeamContext(team), 1);
	}

	private cleanupOnUserLogout(): void {
		try {
			this.userService.userChanged.pipe(this.takeUntilNeeded()).subscribe({
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
		console.log(
			`${this.className}.setNewTeamContext(id=${teamContext?.id}), previous id=${this.teamContext?.id}`,
			teamContext,
		);
		if (!teamContext?.type && this.teamContext?.type) {
			throw new Error('!teamContext?.type && this.teamContext?.type');
		}
		if (this.teamContext == teamContext) {
			console.warn(
				'Duplicate call to TeamPageComponent.setNewTeamContext() with same teamContext:',
				teamContext,
			);
			return;
		}
		const idChanged = this.teamContext?.id != teamContext?.id;
		const teamTypeChanged = this.teamContext?.type != teamContext?.type;
		const briefChanged = equalTeamBriefs(
			this.teamContext?.brief,
			teamContext?.brief,
		);
		const dtoChanged = this.teamContext?.dto != teamContext?.dto;
		console.log(
			`${this.className} extends TeamPageComponent.setNewTeamContext(id=${teamContext?.id}) => idChanged=${idChanged}, teamTypeChanged=${teamTypeChanged}, briefChanged=${briefChanged}, dtoChanged=${dtoChanged}`,
		);
		this.teamContext = teamContext;
		if (idChanged) {
			this.teamIDChanged.next(teamContext?.id);
			this.onTeamIdChanged();
			if (teamContext) {
				setTimeout(() => this.subscribeForTeamChanges(teamContext), 1);
				setTimeout(() => this.subscribeForContactusTeamChanges(teamContext), 1);
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
	// };

	private readonly onTeamContextChanged = (team: ITeamContext): void => {
		const dtoChanged = team.dto !== this.teamContext?.dto;
		console.log(
			`${this.className}.onTeamContextChanged() => dtoChanged=${dtoChanged}, team:`,
			team,
		);
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
		// console.log(`${this.className} => loaded team record:`, newTeam);
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

	protected teamPageUrl(page: string): string {
		return teamPageUrl(this.teamContext, page) || '';
	}
}

export const teamPageUrl = (
	team?: ITeamContext,
	page?: string,
): string | undefined => {
	return team?.id
		? page
			? `/space/${team.type}/${team.id}/${page}`
			: `/space/${team.type}/${team.id}`
		: undefined;
};
