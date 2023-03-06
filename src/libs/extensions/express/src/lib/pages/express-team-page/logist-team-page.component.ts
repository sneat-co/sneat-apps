import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';
import { ILogistTeamContext } from '../../dto/express-team-dto';
import { LogistTeamService } from '../../services/logist-team.service';

@Component({
	selector: 'sneat-express-main-page',
	templateUrl: './logist-team-page.component.html',
	styleUrls: ['./logist-team-page.component.scss'],
})
export class LogistTeamPageComponent extends TeamBaseComponent {
	expressTeam?: ILogistTeamContext;

	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		private readonly expressTeamService: LogistTeamService,
	) {
		super('LogistTeamPageComponent', route, teamParams);
	}

	protected override onTeamIdChanged() {
		super.onTeamIdChanged();
		const team = this.team;
		if (team?.id) {
			this.expressTeamService.watchExpressTeamByID(team.id)
				.pipe(this.takeUntilNeeded())
				.subscribe({
					next: expressTeam => {
						this.expressTeam = expressTeam;
					},
					error: err => {
						this.errorLogger.logError(err, 'failed to load express team', {
							show: !('' + err).includes('Missing or insufficient permissions'), // TODO: fix & handle properly
						});
						this.expressTeam = { id: team.id };
					},
				});
		}
	}
}
