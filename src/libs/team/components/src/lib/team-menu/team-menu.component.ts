import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ITeamContext } from '@sneat/team/models';
import { TeamPageContextComponent } from '../team-page-context';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IonMenu, MenuController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'sneat-team-menu',
	templateUrl: './team-menu.component.html',
	styleUrls: ['./team-menu.component.scss'],
})
export class TeamMenuComponent implements OnInit {

	@ViewChild(TeamPageContextComponent) context?: TeamPageContextComponent;

	public team?: ITeamContext;
	public teamId? = 'abc123';

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		readonly route: ActivatedRoute,
		private readonly navCtrl: NavController,
		private readonly menuCtrl: MenuController,
	) {
		route.paramMap.subscribe({
			next: params => {
				const teamId = params.get('teamId');
				const teamType = params.get('teamType');
				console.log('TeamMenuComponent, params:', teamId, teamType);
				if (teamId) {
					this.teamId = `${teamType}/${teamId}`;
				} else {
					this.teamId = undefined;
				}
			},
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
		this.navCtrl.navigateRoot('/space/' + this.teamId).catch(console.error);
		this.menuCtrl.close().catch(console.error);
	}
}
