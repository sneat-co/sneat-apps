import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from "@angular/core";
import { NavController } from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
import { BaseTeamPageDirective } from "@sneat/team/components";
import { ErrorLogger, IErrorLogger } from "@sneat/logging";
import { AnalyticsService, IAnalyticsService } from "@sneat/analytics";
import { SneatUserService } from "@sneat/user";
import { TeamNavService, TeamService } from "@sneat/team/services";

@Component({
	selector: "sneat-team",
	templateUrl: "./team-page.component.html"
})
export class TeamPageComponent extends BaseTeamPageDirective {
	public teamId?: string;

	constructor(
		override readonly changeDetectorRef: ChangeDetectorRef,
		override readonly route: ActivatedRoute,
		@Inject(ErrorLogger)
		override readonly errorLogger: IErrorLogger,
		override readonly navController: NavController,
		override readonly teamService:TeamService,
		override readonly userService: SneatUserService,
		@Inject(AnalyticsService)
		private readonly analyticsService: IAnalyticsService,
		public readonly navService: TeamNavService
	) {

		super(
			changeDetectorRef,
			route,
			errorLogger,
			navController,
			teamService,
			userService
		);
		console.log("TeamPage.constructor()");
		this.trackTeamIdFromUrl();
	}

	// noinspection JSUnusedGlobalSymbols
	ionViewDidEnter() {
		this.analyticsService.setCurrentScreen("Team");
	}
}
