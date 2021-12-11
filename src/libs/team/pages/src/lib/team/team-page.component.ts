import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { BaseTeamPageDirective } from '../base-team-page-directive';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { AnalyticsService, IAnalyticsService } from '@sneat/analytics';
import { SneatUserService } from '@sneat/user';
import { TeamContextService, TeamNavService, TeamService } from "@sneat/team/services";

@Component({
	selector: 'sneat-team',
	templateUrl: './team-page.component.html',
})
export class TeamPageComponent extends BaseTeamPageDirective {
	public teamId?: string;

	constructor(
		readonly changeDetectorRef: ChangeDetectorRef,
		readonly route: ActivatedRoute,
		@Inject(ErrorLogger) readonly errorLogger: IErrorLogger,
		readonly navController: NavController,
		readonly teamService: TeamService,
		readonly userService: SneatUserService,
		readonly teamContextService: TeamContextService,
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
			teamContextService,
			userService
		);
		console.log('TeamPage.constructor()');
		this.trackTeamIdFromUrl('id');
	}

	// noinspection JSUnusedGlobalSymbols
	ionViewDidEnter() {
		this.analyticsService.setCurrentScreen('Team');
	}
}
