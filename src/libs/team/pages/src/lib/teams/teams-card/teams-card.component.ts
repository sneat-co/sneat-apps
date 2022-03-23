import { Component, Inject, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { IonInput, ToastController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { ErrorLogger, IErrorLogger } from "@sneat/logging";
import { IUserTeamInfoWithId } from "@sneat/auth-models";
import { ISneatUserState, SneatUserService } from "@sneat/user";
import { AnalyticsService, IAnalyticsService } from "@sneat/analytics";
import { ICreateTeamRequest } from "@sneat/team/models";
import { TeamNavService, TeamService } from "@sneat/team/services";

@Component({
	selector: "sneat-teams-card",
	templateUrl: "./teams-card.component.html",
})
export class TeamsCardComponent implements OnInit, OnDestroy {
	@ViewChild(IonInput, { static: false }) addTeamInput?: IonInput; // TODO: IonInput;

	public teams?: IUserTeamInfoWithId[];

	public teamName = "";
	public adding = false;
	public showAdd = false; //

	private subscriptions: Subscription[] = [];

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly navService: TeamNavService,
		private readonly userService: SneatUserService,
		private readonly teamService: TeamService,
		@Inject(AnalyticsService)
		private readonly analyticsService: IAnalyticsService,
		private readonly toastController: ToastController,
	) {
	}

	public ngOnDestroy(): void {
		console.log("HomePage.ngOnDestroy()");
		this.unsubscribe("ngOnDestroy");
	}

	public ngOnInit(): void {
		this.subscriptions.push(
			this.userService.userChanged.subscribe({
				next: (uid) => {
					console.log("HomePage.ngOnInit() => userChanged:", uid);
					this.teams = undefined;
					if (!uid) {
						this.unsubscribe("user signed out");
						return;
					}
					this.subscriptions.push(
						this.userService.userState.subscribe({
							next: this.setUser,
							error: (err) =>
								this.errorLogger.logError(err, "Failed to get user record"),
						}),
					);
				},
				error: (err) => this.errorLogger.logError(err, "Failed to get user ID"),
			}),
		);
	}

	public goTeam(team: IUserTeamInfoWithId) {
		this.navService.navigateToTeam(team.id, team, undefined, "forward");
	}

	public addTeam() {
		this.analyticsService.logEvent("addTeam");
		const title = this.teamName.trim();
		if (!title) {
			this.toastController
				.create({
					position: "middle",
					message: "Team name is required",
					color: "tertiary",
					duration: 5000,
					keyboardClose: true,
					buttons: [{ role: "cancel", text: "OK" }],
				})
				.then((toast) =>
					toast
						.present()
						.catch((err) =>
							this.errorLogger.logError(err, "Failed to present toast"),
						),
				)
				.catch((err) =>
					this.errorLogger.logError(err, "Faile to create toast"),
				);
			return;
		}
		if (this.teams?.find((t) => t.title === title)) {
			this.toastController
				.create({
					message: "You already have a team with the same name",
					color: "danger",
					buttons: ["close"],
					position: "middle",
					animated: true,
					duration: 3000,
				})
				.then((toast) => {
					toast
						.present()
						.catch((err) =>
							this.errorLogger.logError(err, "Failed to present toast"),
						);
				})
				.catch((err) =>
					this.errorLogger.logError(err, "Failed to create toast"),
				);
			return;
		}
		const request: ICreateTeamRequest = { title };
		this.adding = true;
		this.teamService.createTeam(request).subscribe({
			next: (team) => {
				this.analyticsService.logEvent("teamCreated", { team: team.id });
				console.log("teamId:", team.id);
				const userTeam: IUserTeamInfoWithId = { id: team.id, title: team?.data?.title || team.id };
				if (userTeam && !this.teams?.find((t) => t.id === team.id)) {
					this.teams?.push(userTeam);
				}
				this.adding = false;
				this.teamName = "";
				this.goTeam(userTeam);
			},
			error: (err) => {
				this.errorLogger.logError(err, "Failed to create new team record");
				this.adding = false;
			},
		});
	}

	public startAddingTeam(): void {
		this.showAdd = true;
		setTimeout(() => {
			if (!this.addTeamInput) {
				this.errorLogger.logError("addTeamInput is not set");
				return;
			}
			this.addTeamInput
				.setFocus()
				.catch((err) =>
					this.errorLogger.logError(
						err,
						"Failed to set focus to \"addTeamInput\"",
					),
				);
		}, 100);
	}

	public leaveTeam(teamInfo: IUserTeamInfoWithId, event?: Event): void {
		if (event) {
			event.stopPropagation();
			event.preventDefault();
		}
		if (!confirm(`Are you sure you want to leave team ${teamInfo.title}?`)) {
			return;
		}
		this.teamService
			.getTeam(teamInfo.id)
			.pipe(
				mergeMap(team => {
					const { currentUserId } = this.userService;
					const userMember = team?.members.find((m) => m.uid === currentUserId);
					if (!userMember) {
						return [team];
					}
					return this.teamService.removeTeamMember(
						{ id: teamInfo.id, data: team },
						userMember.id,
					);
				}),
			)
			.subscribe({
				next: (response) => console.log("left team:", response),
				error: (err) =>
					this.errorLogger.logError(
						err,
						`Failed to leave a team: ${teamInfo.title}`,
					),
			});
	}

	private unsubscribe(reason?: string): void {
		console.log(`HomePage.unsubscribe(reason: ${reason})`);
		this.subscriptions.forEach((s) => s.unsubscribe());
		this.subscriptions = [];
	}

	private setUser = (userState: ISneatUserState): void => {
		console.log("HomePage => user:", userState);
		const user = userState.record;
		if (user) {
			this.teams = Object.entries(user?.teams ? user.teams : {}).map(
				([id, team]) => ({ id, ...(team as any) }),
			);
			this.teams.sort((a, b) => (a.title > b.title ? 1 : -1));
			this.showAdd = !this.teams?.length;
			if (this.showAdd) {
				this.startAddingTeam();
			}
		} else {
			this.teams = undefined;
		}
	};
}
