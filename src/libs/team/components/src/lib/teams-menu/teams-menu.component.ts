import { Component, Inject } from '@angular/core';
import { ISneatUserState, SneatUserService } from '@sneat/user';
import { IUserTeamInfo } from '@sneat/auth-models';
import { TeamService } from '@sneat/team/services';
import { ICreateTeamRequest } from '@sneat/team/models';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { NavController } from '@ionic/angular';

@Component({
	selector: 'sneat-teams-menu',
	templateUrl: './teams-menu.component.html',
	styleUrls: ['./teams-menu.component.scss'],
})
export class TeamsMenuComponent {

	teams?: IUserTeamInfo[];
	familyTeams?: IUserTeamInfo[];
	familyTeam?: IUserTeamInfo;

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
			this.familyTeams = this.teams.filter(t => t.type === 'family') || [];
			this.familyTeam = this.familyTeams.length === 1 ? this.familyTeams[0] : undefined;
			if (this.familyTeam) {
				this.teams = this.teams.filter(t => t.type !== 'family');
			}
		}
	};
}
