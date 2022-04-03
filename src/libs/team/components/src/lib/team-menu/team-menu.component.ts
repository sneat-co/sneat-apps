import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { IUserTeamInfo } from '@sneat/auth-models';
import { ISneatUserState } from '@sneat/user';
import { TeamBaseComponent } from '../team-base.component';
import { TeamComponentBaseParams } from '../team-component-base-params';

@Component({
	selector: 'sneat-team-menu',
	templateUrl: './team-menu.component.html',
	styleUrls: ['./team-menu.component.scss'],
})
export class TeamMenuComponent extends TeamBaseComponent {

	public teams?: IUserTeamInfo[];

	constructor(
		route: ActivatedRoute,
		params: TeamComponentBaseParams,
		private readonly menuCtrl: MenuController,
	) {
		super('TeamMenuComponent', route, params);
		params.userService.userState.subscribe({
			next: this.trackUserState,
			error: this.errorLogger.logErrorHandler('failed to get user stage'),
		});
	}

	public closeMenu(): void {
		this.menuCtrl.close();
	}

	override onTeamDtoChanged(): void {
		super.onTeamDtoChanged();
		console.log('TeamMenuComponent.onTeamDtoChanged()', this.team?.dto);
	}

	spaceLabelClicked(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
	}

	isCurrentPage(page: string): boolean {
		if (!this.team) {
			return false;
		}
		const { id } = this.team;
		const idp = '/' + id;
		const { pathname } = location;
		if (page === 'overview') {
			return pathname.endsWith(idp);
		}
		return pathname.endsWith(idp + '/' + page) || pathname.indexOf(idp + '/' + page) > 0;
	}

	onTeamSelected(event: Event): void {
		const teamID = (event as CustomEvent).detail.value as string;

		console.log('onTeamSelected', teamID);
		if (teamID === this.team?.id) {
			return;
		}
		const team = this.teams?.find(t => t.id === teamID);
		if (team) {
			this.teamParams.navController.navigateRoot(`/space/${team.type}/${team.id}`).catch(console.error);
		}
		this.menuCtrl.close().catch(console.error);
		return;
	}

	private trackUserState = (userState: ISneatUserState): void => {
		console.log('trackUserState =>', userState);
		// setTimeout(() => {
		// }, 100);
		if (userState?.record) {
			this.teams = userState.record.teams || [];
		} else {
			this.teams = undefined;
		}
		console.log('teams:', this.teams);
	};
}
