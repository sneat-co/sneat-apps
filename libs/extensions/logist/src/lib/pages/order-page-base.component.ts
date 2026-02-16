import { SpaceBaseComponent } from '@sneat/space-components';
import { ILogistOrderContext } from '../dto';
import { LogistOrderService } from '../services';

// @Directive() // we need this decorator so we can implement Angular interfaces
export abstract class OrderPageBaseComponent extends SpaceBaseComponent {
  protected order?: ILogistOrderContext;
  numberOfDispatchers?: number;

  protected constructor(private readonly orderService: LogistOrderService) {
    super();
    this.route.paramMap.pipe(this.takeUntilDestroyed()).subscribe((params) => {
      this.order = {
        id: params.get('orderID') || '',
        space: { id: params.get('spaceID') || '' },
      };
      if (this.space?.id && this.order?.id) {
        this.orderService
          .watchOrderByID(this.space.id, this.order.id)
          .subscribe({
            next: (order) => {
              this.setOrder(order);
              this.order = order;
            },
            error: this.errorLogger.logErrorHandler('failed to load order'),
          });
      }
    });
  }

  private setOrder(order: ILogistOrderContext): void {
    this.order = order;
    this.numberOfDispatchers = order?.dbo?.counterparties?.filter(
      (c) => c.role === 'dispatcher',
    ).length;
    this.onOrderChanged(order);
  }

  protected onOrderChanged(_order: ILogistOrderContext): void {
    // override this method to handle order changes
  }
}
