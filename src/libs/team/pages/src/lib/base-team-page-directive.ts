import { ActivatedRoute } from "@angular/router";
import { NavController } from "@ionic/angular";
import { ChangeDetectorRef, Directive, Inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { first, mergeMap, takeUntil } from "rxjs/operators";
import { ErrorLogger, IErrorLogger } from "@sneat/logging";
import { IUserTeamInfoWithId } from "@sneat/auth-models";
import { IRecord } from "@sneat/data";
import { TeamService, trackTeamIdFromRouteParameter } from "@sneat/team/services";
import { SneatUserService } from "@sneat/user";
import { ITeam } from "@sneat/team/models";
import { TeamPageContextComponent } from "@sneat/team/components";

@Directive() // There was some reason to add a @Directive() - TODO: document why
export abstract class BaseTeamPageDirective implements OnInit, OnDestroy {

	@ViewChild(TeamPageContextComponent) context?: TeamPageContextComponent;

	public userTeam?: IUserTeamInfoWithId;

	protected readonly subs = new Subscription();
	protected readonly destroyed = new Subject<boolean>();
	protected readonly logError = this.errorLogger.logError;

	public get team() {
		return this.teamRecord;
	}

	public get currentUserId() {
		return this.userService.currentUserId;
	}

	public get defaultBackUrl(): string {
		return this.teamRecord?.id ? `team?id=${this.teamRecord.id}` : "teams";
	}

	private teamRecord?: IRecord<ITeam>;

	protected constructor(
		protected readonly changeDetectorRef: ChangeDetectorRef,
		protected readonly route: ActivatedRoute,
		@Inject(ErrorLogger) protected readonly errorLogger: IErrorLogger,
		protected readonly navController: NavController,
		protected readonly teamService: TeamService,
		protected readonly userService: SneatUserService
	) {
		console.log(`BaseTeamPage.constructor()`);
		try {
			this.getUserTeamInfoFromState();
			this.getTeamRecordFromState();
			this.cleanupOnUserLogout();
		} catch (e) {
			this.logError(e, "Failed in BaseTeamPageDirective.constructor()");
		}
	}

	public ngOnDestroy() {
		this.unsubscribe("ngOnDestroy");
		this.destroyed.next(true);
		this.destroyed.complete();
	}

	protected unsubscribe(reason: string): void {
		console.log(`unsubscribe(reason: ${reason})`);
		this.subs.unsubscribe();
	}

	protected trackTeamIdFromUrl(): void {
		try {
			trackTeamIdFromRouteParameter(this.route)
				.pipe(takeUntil(this.destroyed))
				.subscribe({
					next: (teamId) => {
						console.log(
							`BaseTeamPageDirective.trackTeamIdFromUrl() =>`, teamId
						);
						this.setTeamId(teamId || undefined);
					},
					error: (err) =>
						this.logError(err, "Failed to track team ID from url")
				});
		} catch (e) {
			this.logError(e, "Failed to call teamContextService.trackUrl()");
		}
	}

	protected onUserIdChanged(): void {
		if (!this.currentUserId) {
			this.subs.unsubscribe();
			if (this.team) {
				this.teamRecord = { id: this.team.id }; // Hide team data
				this.onTeamChanged();
			}
		}
	}

	protected onTeamIdChanged(): void {
		console.log("BaseTeamPageDirective.onTeamIdChanged()");
	}

	protected onTeamChanged(): void {
		console.log("BaseTeamPageDirective.onTeamChanged()");
		if (this.team?.data) {
			this.userTeam = this.teamRecord
				? { id: this.team?.id, title: this.team.data.title }
				: undefined;
		}
	}

	private getUserTeamInfoFromState(): void {
		this.userTeam = history.state?.userTeamInfoWithId;
		if (this.userTeam) {
			this.teamRecord = { id: this.userTeam.id };
			this.onTeamIdChanged();
		}
	}

	private getTeamRecordFromState(): void {
		try {
			this.teamRecord = history.state?.team as IUserTeamInfoWithId;
			if (this.teamRecord) {
				this.onTeamIdChanged();
				this.onTeamChanged();
			}
		} catch (e) {
			this.logError(e, "Failed in BaseTeamPage.constructor()");
		}
	}

	private cleanupOnUserLogout(): void {
		try {
			this.userService.userChanged.pipe(takeUntil(this.destroyed)).subscribe({
				next: (uid) => {
					if (!uid) {
						this.unsubscribe("user signed out");
						this.teamRecord = undefined;
					}
					this.onUserIdChanged();
				},
				error: (e) => this.logError(e, "Failed to get user record")
			});
		} catch (e) {
			this.logError(
				e,
				"Failed to subscribe a hook on page cleanup on user logout"
			);
		}
	}

	private setTeamId(id: string | undefined): void {
		try {
			if (id) {
				if (this.teamRecord?.id !== id) {
					console.log(`setTeamId(${id}), previous id=${this.teamRecord?.id}`);
					this.teamRecord = { id };
					this.onTeamIdChanged();
					this.subs.add(
						this.userService.userChanged
							.pipe(
								first(),
								mergeMap(() => this.teamService.watchTeam(id))
							)
							.subscribe({
								next: (data) => this.setTeam({ id, data: data || undefined }),
								error: (err) =>
									this.logError(err, `failed to load team by id=${id}`)
							})
					);
				}
			} else if (this.teamRecord) {
				const hadData = !!this.teamRecord.data;
				const hadId = !!this.teamRecord.id;
				this.teamRecord = undefined;
				if (hadId) {
					this.onTeamIdChanged();
				}
				if (hadData) {
					this.onTeamChanged();
				}
			}
		} catch (e) {
			this.logError(e, "Failed to set team id");
		}
	}

	private setTeam(team: IRecord<ITeam>): void {
		console.log("BaseTeamPageDirective.setTeam()", team);
		this.teamRecord = team;
		this.onTeamChanged();
	}

	ngOnInit(): void {
		this.context?.team.subscribe({
			next: team => {
				team?.id;
			}
		});
	}
}
