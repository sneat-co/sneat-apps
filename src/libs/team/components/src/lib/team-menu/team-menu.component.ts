import { Component, Inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { ITeamContext } from '@sneat/team/models';
import { TeamPageContextComponent } from '../team-page-context';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { MenuController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { IUserTeamInfo } from '@sneat/auth-models';
import { ISneatUserState, SneatUserService } from '@sneat/user';

@Component({
	selector: 'sneat-team-menu',
	templateUrl: './team-menu.component.html',
	styleUrls: ['./team-menu.component.scss'],
})
export class TeamMenuComponent implements OnInit {

	@ViewChild(TeamPageContextComponent) context?: TeamPageContextComponent;

	public team?: ITeamContext;
	public teamId?: string = undefined;
	public teamType?: string = undefined;
	public teams?: IUserTeamInfo[];

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		readonly route: ActivatedRoute,
		readonly userService: SneatUserService,
		private readonly navCtrl: NavController,
		private readonly menuCtrl: MenuController,
		private readonly zone: NgZone,
	) {
		route.paramMap.subscribe({
			next: params => {
				this.teamId = params.get('teamId') || undefined;
				this.teamType = params.get('teamType') || undefined;
				console.log('TeamMenuComponent, params:', this.teamId, this.teamType);
			},
		});
		userService.userState.subscribe({
			next: this.trackUserState,
			error: this.errorLogger.logErrorHandler('failed to get user stage'),
		});
	}

	ngOnInit(): void {
		this.context?.team.subscribe({
			next: team => {
				this.team = team || undefined;
			},
			error: this.errorLogger.logErrorHandler,
		});
	}

	onTeamSelected(event: Event): void {
		console.log('onTeamSelected', this.teamId);
		this.navCtrl.navigateRoot(`/space/${this.teamType}/${this.teamId}`).catch(console.error);
		this.menuCtrl.close().catch(console.error);
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
