import { SpaceBaseComponent } from '@sneat/space-components';
import { ILogistSpaceContext } from '../dto';
import { LogistSpaceService } from '../services';

export class LogistSpaceBaseComponent extends SpaceBaseComponent {
	protected logistSpace?: ILogistSpaceContext;

	constructor(
		className: string,
		private readonly logistSpaceService: LogistSpaceService,
	) {
		super(className);
	}

	protected override onSpaceIdChanged() {
		super.onSpaceIdChanged();
		const space = this.space;
		if (space?.id) {
			this.logistSpaceService
				.watchLogistSpaceByID(space.id)
				.pipe(this.takeUntilDestroyed())
				.subscribe({
					next: (logistSpace) => {
						console.log('logistSpace:', logistSpace);
						this.logistSpace = logistSpace;
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
