import { AfterViewInit, ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { AnalyticsService, IAnalyticsService } from '@sneat/analytics';
import { SneatUserService } from '@sneat/user';
import { TeamNavService, TeamService } from '@sneat/team/services';
import { BaseTeamPageDirective, TeamPageContextComponent } from '@sneat/team/components';

@Component({
	selector: 'sneat-team',
	templateUrl: './team-page.component.html',
})
export class TeamPageComponent extends BaseTeamPageDirective implements AfterViewInit {

	@ViewChild('teamPageContext')
	public teamPageContext?: TeamPageContextComponent;

	constructor(
		override readonly changeDetectorRef: ChangeDetectorRef,
		@Inject(ErrorLogger)
		override readonly errorLogger: IErrorLogger,
		override readonly navController: NavController,
		override readonly teamService: TeamService,
		override readonly userService: SneatUserService,
		@Inject(AnalyticsService)
		readonly analyticsService: IAnalyticsService,
		readonly navService: TeamNavService,
	) {

		super(
			changeDetectorRef,
			errorLogger,
			navController,
			teamService,
			userService,
		);
		console.log('TeamPage.constructor()');
		// this.trackTeamIdFromUrl();
	}

	// noinspection JSUnusedGlobalSymbols
	ionViewDidEnter() {
		// this.analyticsService.setCurrentScreen('Team');
	}

	ngAfterViewInit(): void {
		if (this.teamPageContext)
			this.setTeamPageContext(this.teamPageContext);
		else
			this.errorLogger.logError('teamPageContext is not set')
	}
}
