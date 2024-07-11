import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule, MenuController, NavController } from '@ionic/angular';
import { ISneatUserState, SneatUserService } from '@sneat/auth-core';
import { UserRequiredFieldsService } from '@sneat/auth-ui';
import { SpaceType } from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	ICreateSpaceRequest,
	ISpaceContext,
	spaceContextFromBrief,
	zipMapBriefsWithIDs,
} from '@sneat/team-models';
import { TeamNavService, TeamService } from '@sneat/team-services';
import { first } from 'rxjs';
import { TeamsListComponent } from '../teams-list';

@Component({
	selector: 'sneat-teams-menu',
	templateUrl: './teams-menu.component.html',
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		RouterModule,
		TeamsListComponent,
	],
	providers: [UserRequiredFieldsService],
})
export class TeamsMenuComponent {
	@Input() spacesLabel = 'Spaces';
	@Input() teamType?: SpaceType;
	@Input() pathPrefix = '/space';

	teams?: ISpaceContext[];
	familyTeams?: ISpaceContext[];
	familyTeam?: ISpaceContext;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		readonly userService: SneatUserService,
		private readonly teamService: TeamService,
		private readonly teamNavService: TeamNavService,
		private readonly navController: NavController,
		private readonly menuController: MenuController,
		private readonly userRequiredFieldsService: UserRequiredFieldsService,
	) {
		userService.userState.subscribe({
			next: this.onUserStateChanged,
		});
	}

	public newFamily(event: Event): boolean {
		event.stopPropagation();
		event.preventDefault();

		const request: ICreateSpaceRequest = {
			type: 'family',
			// roles: [TeamMemberType.creator],
		};

		this.userService.userState.pipe(first()).subscribe({
			next: (userState) => {
				if (userState.record) {
					this.createTeam(request);
				} else {
					this.userRequiredFieldsService
						.open()
						.then((modalResult) => {
							if (modalResult) {
								this.createTeam(request);
							}
						})
						.catch(
							this.errorLogger.logErrorHandler(
								'Failed to open user required fields modal',
							),
						);
				}
			},
		});
		this.closeMenu();
		return false;
	}

	private createTeam(request: ICreateSpaceRequest): void {
		this.teamService.createSpace(request).subscribe({
			next: (value) => {
				console.log('Team created:', value);
				this.navController
					.navigateForward('/space/family/' + value.id)
					.catch(
						this.errorLogger.logErrorHandler(
							'failed to navigate to newly created family team',
						),
					);
			},
			error: this.errorLogger.logErrorHandler(
				'failed to create a new family team',
			),
		});
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

		this.teams = user?.record?.spaces
			? zipMapBriefsWithIDs(user?.record?.spaces)
					.filter((t) => !this.teamType || t.brief.type === this.teamType)
					.map((t) => spaceContextFromBrief(t.id, t.brief))
			: [];

		this.familyTeams = this.teams?.filter((t) => t.type === 'family') || [];
		this.familyTeam =
			this.familyTeams.length === 1 ? this.familyTeams[0] : undefined;

		if (this.familyTeam) {
			this.teams = this.teams?.filter((t) => t.type !== 'family');
		}
	};

	public closeMenu(): void {
		this.menuController
			.close()
			.catch(this.errorLogger.logErrorHandler('Failed to close teams menu'));
	}
}
