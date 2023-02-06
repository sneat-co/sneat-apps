import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ISneatUserState } from '@sneat/auth';
import { IUserTeamBrief } from '@sneat/auth-models';
import { takeUntil } from 'rxjs/operators';
import { TeamBaseComponent } from '../team-base.component';
import { TeamComponentBaseParams } from '../team-component-base-params';

@Component({
	selector: 'sneat-team-menu',
	templateUrl: './team-menu.component.html',
	styleUrls: ['./team-menu.component.scss'],
})
export class TeamMenuComponent extends TeamBaseComponent {

	public teams?: IUserTeamBrief[];

	constructor(
		route: ActivatedRoute,
		params: TeamComponentBaseParams,
		private readonly menuCtrl: MenuController,
	) {
		super('TeamMenuComponent', route, params);
		params.userService.userState
			.pipe(
				takeUntil(this.destroyed),
			)
			.subscribe({
				next: this.trackUserState,
				error: this.errorLogger.logErrorHandler('failed to get user stage'),
			});
	}

	public goOverview(): boolean {
		if (!this.team) {
			this.errorLogger.logError('no team context');
			return false;
		}
		this.teamParams.teamNavService.navigateToTeam(this.team).then(v => {
			if (v) {
				this.closeMenu();
			}
		});
		return false;
	}

	public goTeamPage(event: Event, p: string): boolean {
		event.stopPropagation();
		event.preventDefault();
		this.closeMenu();
		return false;
	}

	public closeMenu(): void {
		this.menuCtrl.close().catch(this.errorLogger.logError);
	}

	override onTeamDtoChanged(): void {
		super.onTeamDtoChanged();
		// console.log('TeamMenuComponent.onTeamDtoChanged()', this.team?.dto);
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

		// console.log('TeamMenuComponent.onTeamSelected', teamID);
		if (teamID === this.team?.id) {
			return;
		}
		const team = this.teams?.find(t => t.id === teamID);
		if (team) {
			this.teamNav.navigateToTeam(team).catch(this.errorLogger.logErrorHandler('Failed to navigate to teams page on current team changed from team menu dropdown'));
		}
		this.menuCtrl.close().catch(console.error);
		return;
	}

	private trackUserState = (userState: ISneatUserState): void => {
		// console.log('TeamMenuComponent.trackUserState =>', userState);
		if (userState?.record) {
			this.teams = userState.record.teams || [];
		} else {
			this.teams = undefined;
		}
	};
}
