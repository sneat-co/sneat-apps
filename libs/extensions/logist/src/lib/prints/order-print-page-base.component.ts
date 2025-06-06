import { Directive } from '@angular/core';
import { CounterpartyRole, IOrderCounterparty } from '../dto';

import { OrderPageBaseComponent } from '../pages/order-page-base.component';

@Directive() // we need this decorator so we can implement Angular interfaces
export class OrderPrintPageBaseComponent extends OrderPageBaseComponent {
	constructor(className: string) {
		super(className);
	}

	protected counterpartyByRole(
		role: CounterpartyRole,
	): IOrderCounterparty | undefined {
		return this.order?.dbo?.counterparties?.find((c) => c.role === role);
	}
}
