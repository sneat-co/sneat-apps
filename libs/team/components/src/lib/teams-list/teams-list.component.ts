import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule, MenuController, NavController } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/team-models';
import { TeamNavService, TeamService } from '@sneat/team-services';
import { SneatUserService } from '@sneat/auth-core';

@Component({
	selector: 'sneat-teams-list',
	templateUrl: 'teams-list.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule, RouterModule],
})
export class TeamsListComponent {
	@Input() pathPrefix = '/space';
	@Input() iconName = 'people-outline';
	@Input() teams?: ISpaceContext[];
	@Output() readonly beforeNavigateToTeam = new EventEmitter<ISpaceContext>();

	protected readonly id = (_: number, o: { id: string }) => o.id;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		readonly userService: SneatUserService,
		private readonly teamService: TeamService,
		private readonly teamNavService: TeamNavService,
		private readonly navController: NavController,
		private readonly menuController: MenuController,
	) {}

	public goTeam(event: Event, team: ISpaceContext): boolean {
		event.stopPropagation();
		this.beforeNavigateToTeam.emit(team);
		this.teamNavService
			.navigateToSpace(team)
			.catch(
				this.errorLogger.logErrorHandler(
					'Failed to navigate to teams overview page from teams menu',
				),
			);
		return false;
	}
}
