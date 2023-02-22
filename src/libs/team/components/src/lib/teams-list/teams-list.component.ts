import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team/models';
import { TeamNavService, TeamService } from '@sneat/team/services';
import { SneatUserService } from '@sneat/auth';

@Component({
	selector: 'sneat-teams-list',
	templateUrl: 'teams-list.component.html'
})
export class TeamsListComponent {
	@Input() pathPrefix = '/space';
	@Input() iconName = 'people-outline'
	@Input() teams?: ITeamContext[];
	@Output() readonly beforeNavigateToTeam = new EventEmitter<ITeamContext>();

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		readonly userService: SneatUserService,
		private readonly teamService: TeamService,
		private readonly teamNavService: TeamNavService,
		private readonly navController: NavController,
		private readonly menuController: MenuController,
	){}

	public goTeam(event: Event, team: ITeamContext): boolean {
		event.stopPropagation();
		this.beforeNavigateToTeam.emit(team);
		this.teamNavService.navigateToTeam(team)
			.catch(this.errorLogger.logErrorHandler(
				'Failed to navigate to teams overview page from teams menu'));
		return false;
	}
}
