import { Component, Inject, Input } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { ISneatUserState, SneatUserService } from '@sneat/auth';
import { TeamType } from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ICreateTeamRequest, ITeamContext, teamContextFromBrief } from '@sneat/team/models';
import { TeamNavService, TeamService } from '@sneat/team/services';

@Component({
	selector: 'sneat-teams-menu',
	templateUrl: './teams-menu.component.html',
})
export class TeamsMenuComponent {

	@Input() spacesLabel = 'Spaces';
	@Input() teamType?: TeamType;
	@Input() pathPrefix = '/space';

	teams?: ITeamContext[];
	familyTeams?: ITeamContext[];
	familyTeam?: ITeamContext;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		readonly userService: SneatUserService,
		private readonly teamService: TeamService,
		private readonly teamNavService: TeamNavService,
		private readonly navController: NavController,
		private readonly menuController: MenuController,
	) {
		userService.userState.subscribe({
			next: this.onUserStateChanged,
		});
	}


	public newFamily(event: Event): boolean {
		event.stopPropagation();
		console.log('newFamily');
		const request: ICreateTeamRequest = {
			type: 'family',
			// roles: [TeamMemberType.creator],
		};
		this.closeMenu();
		this.teamService.createTeam(request)
			.subscribe({
				next: value => {
					console.log('Team created:', value);
					this.navController.navigateForward('/space/family/' + value.id)
						.catch(this.errorLogger.logErrorHandler('failed to navigate to newly created family team'));
				},
				error: this.errorLogger.logErrorHandler('failed to create a new family team'),
			});
		return false;
	}

	public newTeam(): void {
		alert('Creation of a new team is not implemented yet');
	}

	private onUserStateChanged = (user: ISneatUserState): void => {
		console.log('onUserStateChanged', user);
		if (!user?.record) {
			this.teams = undefined;
			this.familyTeams = undefined;
			this.familyTeam = undefined;
			return;
		}
		this.teams = user?.record?.teams?.filter(t => !this.teamType || t.type === this.teamType)?.map(teamContextFromBrief) || [];
		this.familyTeams = this.teams.filter(t => t.type === 'family') || [];
		this.familyTeam = this.familyTeams.length === 1 ? this.familyTeams[0] : undefined;
		if (this.familyTeam) {
			this.teams = this.teams.filter(t => t.type !== 'family');
		}
	};

	public closeMenu(): void {
		this.menuController.close().catch(this.errorLogger.logErrorHandler('Failed to close teams menu'));
	}
}
