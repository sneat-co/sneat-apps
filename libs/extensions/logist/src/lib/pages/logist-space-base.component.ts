import { SpaceBaseComponent } from '@sneat/space-components';
import { ILogistSpaceContext } from '../dto';
import { LogistSpaceService } from '../services';

export class LogistSpaceBaseComponent extends SpaceBaseComponent {
  protected logistSpace?: ILogistSpaceContext;

  protected constructor(
    private readonly logistSpaceService: LogistSpaceService,
  ) {
    super();
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
