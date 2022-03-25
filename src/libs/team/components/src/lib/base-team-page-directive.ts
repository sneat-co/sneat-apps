import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { ChangeDetectorRef, Directive, Inject, ViewChild } from '@angular/core';
import { Subject, Subscription, tap } from 'rxjs';
import { first, mergeMap, takeUntil } from 'rxjs/operators';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IUserTeamInfoWithId } from '@sneat/auth-models';
import { TeamService, trackTeamIdAndTypeFromRouteParameter } from '@sneat/team/services';
import { SneatUserService } from '@sneat/user';
import { ITeamContext } from '@sneat/team/models';
import { TeamPageContextComponent } from './team-page-context';

@Directive({ selector: '[sneatBaseTeamPage]' }) // There was some reason to add a @Directive() - TODO: document why
export abstract class BaseTeamPageDirective /*implements OnInit, OnDestroy*/ {

	@ViewChild(TeamPageContextComponent)
	context?: TeamPageContextComponent;

	private teamContext?: ITeamContext;
	protected readonly subs = new Subscription();
	protected readonly destroyed = new Subject<boolean>();
	protected readonly logError = this.errorLogger.logError;
	protected readonly logErrorHandler = this.errorLogger.logErrorHandler;

	protected constructor(
		protected readonly changeDetectorRef: ChangeDetectorRef,
		protected readonly route: ActivatedRoute,
		@Inject(ErrorLogger) protected readonly errorLogger: IErrorLogger,
		protected readonly navController: NavController,
		protected readonly teamService: TeamService,
		protected readonly userService: SneatUserService,
	) {
		console.log(`BaseTeamPage.constructor()`);
		try {
			this.getUserTeamInfoFromState();
			this.getTeamRecordFromState();
			this.cleanupOnUserLogout();
			this.trackTeamIdAndTypeFromUrl();
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
				this.teamContext = { id: this.team.id }; // Hide team data
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

	protected onInit(): void {
		this.context?.team.subscribe({
			next: team => {
				team?.id;
			},
		});
	}

	private trackTeamIdAndTypeFromUrl(): void {
		try {
			trackTeamIdAndTypeFromRouteParameter(this.route)
				.pipe(takeUntil(this.destroyed))
				.subscribe({
					next: (teamContext) => {
						console.log(
							`BaseTeamPageDirective.trackTeamIdAndTypeFromUrl() => teamContext:`, teamContext,
						);
						this.setTeamContext(teamContext);
					},
					error: (err) =>
						this.logError(err, 'Failed to track team ID from url'),
				});
		} catch (e) {
			this.logError(e, 'Failed to call teamContextService.trackUrl()');
		}
	}

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
			this.teamContext = history.state?.team as IUserTeamInfoWithId;
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

	private setTeamContext(teamContext?: ITeamContext): void {
		try {
			if (teamContext?.id) {
				if (this.teamContext?.id !== teamContext.id) {
					this.setNewTeamContext(teamContext);
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
	}

	private setTeam(team: ITeamContext): void {
		console.log('BaseTeamPageDirective.setTeam()', team);
		this.teamContext = team;
		this.onTeamChanged();
	}
}
