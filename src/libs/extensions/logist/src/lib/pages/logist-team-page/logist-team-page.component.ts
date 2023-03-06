import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';
import { ILogistTeamContext } from '../../dto/logist-team-dto';
import { LogistTeamService } from '../../services/logist-team.service';

@Component({
	selector: 'sneat-logist-main-page',
	templateUrl: './logist-team-page.component.html',
	styleUrls: ['./logist-team-page.component.scss'],
})
export class LogistTeamPageComponent extends TeamBaseComponent {
	logistTeam?: ILogistTeamContext;

	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		private readonly logistTeamService: LogistTeamService,
	) {
		super('LogistTeamPageComponent', route, teamParams);
	}

	protected override onTeamIdChanged() {
		super.onTeamIdChanged();
		const team = this.team;
		if (team?.id) {
			this.logistTeamService.watchLogistTeamByID(team.id)
				.pipe(this.takeUntilNeeded())
				.subscribe({
					next: expressTeam => {
						this.logistTeam = expressTeam;
					},
					error: err => {
						this.errorLogger.logError(err, 'failed to load logist team', {
							show: !('' + err).includes('Missing or insufficient permissions'), // TODO: fix & handle properly
						});
						this.logistTeam = { id: team.id };
					},
				});
		}
	}
}
