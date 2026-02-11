import { CounterpartyRole, IOrderCounterparty } from '../dto';

import { OrderPageBaseComponent } from '../pages/order-page-base.component';
import { LogistOrderService } from '../services';

// @Directive() // we need this decorator so we can implement Angular interfaces
export abstract class OrderPrintPageBaseComponent extends OrderPageBaseComponent {
  protected constructor(orderService: LogistOrderService) {
    super(orderService);
  }

  protected counterpartyByRole(
    role: CounterpartyRole,
  ): IOrderCounterparty | undefined {
    return this.order?.dbo?.counterparties?.find((c) => c.role === role);
  }
}
