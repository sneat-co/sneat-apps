import { ActivatedRoute } from '@angular/router';
import {
	TeamPageBaseComponent,
	TeamComponentBaseParams,
} from '@sneat/team/components';
import { ILogistTeamContext } from '../dto';
import { LogistTeamService } from '../services';

export class LogistTeamBaseComponent extends TeamPageBaseComponent {
	protected logistTeam?: ILogistTeamContext;

	constructor(
		className: string,
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		private readonly logistTeamService: LogistTeamService,
	) {
		super(className, route, teamParams);
	}

	protected override onTeamIdChanged() {
		super.onTeamIdChanged();
		const team = this.team;
		if (team?.id) {
			this.logistTeamService
				.watchLogistTeamByID(team.id)
				.pipe(this.takeUntilNeeded())
				.subscribe({
					next: (logistTeam) => {
						console.log('logistTeam:', logistTeam);
						this.logistTeam = logistTeam;
					},
					error: (err) => {
						this.errorLogger.logError(err, 'failed to load logist team', {
							show: !('' + err).includes('Missing or insufficient permissions'), // TODO: fix & handle properly
						});
						this.logistTeam = { id: team.id };
					},
				});
		}
	}
}
