import { Directive, Inject, Injectable, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { IUserTeamInfo } from '@sneat/auth-models';
import { LOGGER_FACTORY, NgModulePreloaderService } from '@sneat/core';
import { ErrorLogger, IErrorLogger, ILogErrorOptions } from '@sneat/logging';
import { ILogger, ILoggerFactory } from '@sneat/rxstore';
import { ITeamContext } from '@sneat/team/models';
import { TeamService } from '@sneat/team/services';
import { SneatUserService } from '@sneat/user';
import { Subject, Subscription, tap } from 'rxjs';
import { first, mergeMap, takeUntil } from 'rxjs/operators';
import { TeamPageContextComponent } from './team-page-context';


@Injectable()
// Should be declared in module for each page?
export class TeamComponentBaseParams {
	constructor(
		public readonly navController: NavController,
		//public readonly route: ActivatedRoute, // does not work here as injected route does not have parameters
		// public readonly communeService: ICommuneService,
		// public readonly activeCommuneService: IActiveCommuneService,
		public readonly userService: SneatUserService,
		public readonly teamService: TeamService,
		public readonly preloader: NgModulePreloaderService,
		@Inject(ErrorLogger)
		public readonly errorLogger: IErrorLogger,
		// @Inject(AUTH_STATE_PROVIDER) public readonly authStateService: IAuthStateService,
		@Inject(LOGGER_FACTORY) public readonly loggerFactory: ILoggerFactory,
	) {
	}
}

@Directive({ selector: '[sneatBaseTeamPage]' }) // There was some reason to add a @Directive() - TODO: document why
export abstract class TeamBasePageDirective implements OnInit /*implements OnInit, OnDestroy*/ {

	protected route?: ActivatedRoute;

	protected readonly navController: NavController;
	// protected readonly communeService: ICommuneService;
	// protected readonly activeCommuneService: IActiveCommuneService;
	protected readonly userService: SneatUserService;
	protected readonly teamService: TeamService;
	// protected readonly authStateService: IAuthStateService;
	protected readonly logger: ILogger;

	protected readonly subs = new Subscription();
	protected readonly destroyed = new Subject<boolean>();
	protected readonly logError: (e: any, message?: string, options?: ILogErrorOptions) => void;
	protected readonly logErrorHandler: (
		message?: string,
		options?: ILogErrorOptions,
	) => (error: any) => void;
	private teamContext?: ITeamContext;

	protected constructor(
		@Inject('className')
		public readonly className: string,
		readonly teamParams: TeamComponentBaseParams,
	) {
		console.log(`${className} extends TeamBasePageDirective.constructor()`);

		this.navController = teamParams.navController;
		this.teamService = teamParams.teamService;
		this.userService = teamParams.userService;
		this.logger = teamParams.loggerFactory.getLogger(this.className);
		this.logError = teamParams.errorLogger.logError;
		this.logErrorHandler = teamParams.errorLogger.logErrorHandler;

		try {
			this.getUserTeamInfoFromState();
			this.getTeamRecordFromState();
			this.cleanupOnUserLogout();
		} catch (e) {
			this.logError(e, 'Failed in BaseTeamPageDirective.constructor()');
		}
	}

	public get team() {
		return this.teamContext;
	}

	public get currentUserId() {
		return this.userService.currentUserId;
	}

	public get defaultBackUrl(): string {
		return this.teamContext?.id ? `team?id=${this.teamContext.id}` : 'teams';
	}

	ngOnInit(): void {
		console.log('BaseTeamPageDirective.ngOnInit()');
	}

	protected setTeamPageContext(context?: TeamPageContextComponent): void {
		console.log('setTeamPageContext()', context);
		if (!context) {
			this.logError('TeamPageContextComponent is not provided');
			return;
		}
		this.route = context.route;
		context.team.subscribe({
			next: this.setTeamContext,
			error: context.params.errorLogger?.logErrorHandler('failed to get team context'),
		});
	}

	protected onDestroy() {
		this.unsubscribe('ngOnDestroy');
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
				this.teamContext = { ...this.team, dto: undefined }; // Hide team data
				this.onTeamChanged();
			}
		}
	}

	protected onTeamIdChanged(): void {
		console.log('BaseTeamPageDirective.onTeamIdChanged()');
	}

	protected onTeamChanged(): void {
		console.log('BaseTeamPageDirective.onTeamChanged()');
	}

	// private trackTeamIdAndTypeFromUrl(): void {
	// 	try {
	// 		trackTeamIdAndTypeFromRouteParameter(this.route)
	// 			.pipe(takeUntil(this.destroyed))
	// 			.subscribe({
	// 				next: (teamContext) => {
	// 					console.log(
	// 						`BaseTeamPageDirective.trackTeamIdAndTypeFromUrl() => teamContext:`, teamContext,
	// 					);
	// 					this.setTeamContext(teamContext);
	// 				},
	// 				error: (err) =>
	// 					this.logError(err, 'Failed to track team ID from url'),
	// 			});
	// 	} catch (e) {
	// 		this.logError(e, 'Failed to call teamContextService.trackUrl()');
	// 	}
	// }

	private getUserTeamInfoFromState(): void {
		const teamContext = history.state?.teamContext as ITeamContext;
		if (!teamContext?.id) {
			return;
		}
		if (!this.teamContext) {
			this.teamContext = teamContext;
		}
		if (
			this.teamContext.id == teamContext.id
			&& (
				!this.teamContext.brief && teamContext.brief ||
				!this.teamContext.dto && teamContext.dto
			)
		) {
			this.teamContext = { ...this.teamContext, ...teamContext };
			this.onTeamChanged();
		}
	}

	private getTeamRecordFromState(): void {
		try {
			this.teamContext = history.state?.team as IUserTeamInfo;
			if (this.teamContext) {
				this.onTeamIdChanged();
				this.onTeamChanged();
			}
		} catch (e) {
			this.logError(e, 'Failed in BaseTeamPage.constructor()');
		}
	}

	private cleanupOnUserLogout(): void {
		try {
			this.userService.userChanged.pipe(takeUntil(this.destroyed)).subscribe({
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

	private updateExistingTeamContext(teamContext: ITeamContext): void {
		this.teamContext = teamContext;
	}

	private setNewTeamContext(teamContext: ITeamContext): void {
		console.log(`setNewTeamContext(${teamContext.id}), previous id=${this.teamContext?.id}`);
		this.teamContext = teamContext;
		this.onTeamIdChanged();
		const { id } = teamContext;
		if (!id) {
			this.logError('setNewTeamContext() is called with team context without ID');
			return;
		}
		this.subs.add(
			this.userService.userChanged
				.pipe(
					first(), // TODO: Cancel if user signed out
					mergeMap(() => this.teamService.watchTeam(id)),
					tap(dto => {
						if (dto && teamContext.type && teamContext.type != dto.type) {
							throw new Error(`loaded team=${id} with type=${dto.type} while expected to have type=${teamContext.type}`);
						}
					}),
				)
				.subscribe({
					next: dto => this.setTeam({ ...teamContext, dto }),
					error: this.logErrorHandler(`failed to load team by id=${id}`),
				}),
		);
	}

	private setTeamContext = (teamContext?: ITeamContext | null): void => {
		try {
			if (teamContext?.id) {
				if (this.teamContext?.id !== teamContext.id) {
					this.setNewTeamContext(teamContext);
				} else {
					this.updateExistingTeamContext(teamContext);
				}
			} else if (this.teamContext) {
				const hadData = !!this.teamContext.dto;
				const hadId = !!this.teamContext.id;
				this.teamContext = undefined;
				if (hadId) {
					this.onTeamIdChanged();
				}
				if (hadData) {
					this.onTeamChanged();
				}
			}

		} catch (e) {
			this.logError(e, 'Failed to set team id');
		}
	};

	private setTeam(team: ITeamContext): void {
		console.log('BaseTeamPageDirective.setTeam()', team);
		this.teamContext = team;
		this.onTeamChanged();
	}
}

