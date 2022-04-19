import { Component, Inject } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IUserTeamBrief, TeamMemberType } from '@sneat/auth-models';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ICreateTeamRequest } from '@sneat/team/models';
import { TeamService } from '@sneat/team/services';
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
		private readonly navController: NavController,
	) {
		userService.userState.subscribe({
			next: this.onUserStateChanged,
		});
	}

	public newFamily(): void {
		console.log('newFamily');
		const request: ICreateTeamRequest = {
			type: 'family',
			memberType: TeamMemberType.creator,
		};
		this.teamService.createTeam(request).subscribe({
			next: value => {
				console.log('Team created:', value);
				this.navController.navigateForward('/space/family/' + value.id)
					.catch(this.errorLogger.logErrorHandler('failed to navigate to newly created family team'));
			},
			error: this.errorLogger.logErrorHandler('failed to create a new family team'),
		});
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
}
