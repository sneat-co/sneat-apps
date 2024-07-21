import { ActivatedRoute } from '@angular/router';
import {
	SpaceBaseComponent,
	SpaceComponentBaseParams,
} from '@sneat/team-components';
import { ILogistSpaceContext } from '../dto';
import { LogistSpaceService } from '../services';

export class LogistSpaceBaseComponent extends SpaceBaseComponent {
	protected logistSpace?: ILogistSpaceContext;

	constructor(
		className: string,
		route: ActivatedRoute,
		teamParams: SpaceComponentBaseParams,
		private readonly logistSpaceService: LogistSpaceService,
	) {
		super(className, route, teamParams);
	}

	protected override onSpaceIdChanged() {
		super.onSpaceIdChanged();
		const space = this.space;
		if (space?.id) {
			this.logistSpaceService
				.watchLogistSpaceByID(space.id)
				.pipe(this.takeUntilNeeded())
				.subscribe({
					next: (logistTeam) => {
						console.log('logistTeam:', logistTeam);
						this.logistSpace = logistTeam;
					},
					error: (err) => {
						this.errorLogger.logError(err, 'failed to load logist team', {
							show: !('' + err).includes('Missing or insufficient permissions'), // TODO: fix & handle properly
						});
						this.logistSpace = { id: space.id };
					},
				});
		}
	}
}
