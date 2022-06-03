import { Component, Inject } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { IUserTeamBrief, TeamMemberType } from '@sneat/auth-models';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ICreateTeamRequest, ITeamContext } from '@sneat/team/models';
import { TeamNavService, TeamService } from '@sneat/team/services';
import { ISneatUserState, SneatUserService } from '@sneat/user';

@Component({
	selector: 'sneat-teams-menu',
	templateUrl: './teams-menu.component.html',
	styleUrls: ['./teams-menu.component.scss'],
})
export class TeamsMenuComponent {

	teams?: IUserTeamBrief[];
	familyTeams?: IUserTeamBrief[];
	familyTeam?: IUserTeamBrief;

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

	public goTeam(event: Event, team: ITeamContext): boolean {
		event.stopPropagation();
		this.closeMenu();
		this.teamNavService.navigateToTeam(team)
			.catch(this.errorLogger.logErrorHandler(
				'Failed to navigate to teams overview page from teams menu'));
		return false;
	}

	public newFamily(event: Event): boolean {
		event.stopPropagation();
		console.log('newFamily');
		const request: ICreateTeamRequest = {
			type: 'family',
			// roles: [TeamMemberType.creator],
		};
		this.closeMenu();
		this.teamService.createTeam(request).subscribe({
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
		if (!user?.record) {
			this.teams = undefined;
			this.familyTeams = undefined;
			this.familyTeam = undefined;
			return;
		}
		this.teams = user?.record?.teams || [];
		console.log('onUserStateChanged', this.teams);
		if (this.teams.length) {
			this.familyTeams = this.teams.filter(t => t.teamType === 'family') || [];
			this.familyTeam = this.familyTeams.length === 1 ? this.familyTeams[0] : undefined;
			if (this.familyTeam) {
				this.teams = this.teams.filter(t => t.teamType !== 'family');
			}
		}
	};

	public closeMenu(): void {
		this.menuController.close().catch(this.errorLogger.logErrorHandler('Failed to close teams menu'));
	}
}
