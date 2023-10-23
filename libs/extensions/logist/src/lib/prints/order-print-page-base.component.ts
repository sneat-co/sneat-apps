import { Directive } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamComponentBaseParams } from '@sneat/team-components';
import { CounterpartyRole, IOrderCounterparty } from '../dto';
import { LogistOrderService } from '../services';

import { OrderPageBaseComponent } from '../pages/order-page-base.component';

@Directive() // we need this decorator so we can implement Angular interfaces
export class OrderPrintPageBaseComponent extends OrderPageBaseComponent {
	constructor(
		className: string,
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		orderService: LogistOrderService,
	) {
		super(className, route, teamParams, orderService);
	}

	protected counterpartyByRole(
		role: CounterpartyRole,
	): IOrderCounterparty | undefined {
		return this.order?.dto?.counterparties?.find((c) => c.role === role);
	}
}
