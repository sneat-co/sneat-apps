import { Directive } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FreightOrdersService, IExpressOrderContext, IOrderCounterparty } from '../..';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { OrderPageBaseComponent } from '../pages/order-page-base.component';

@Directive() // we need this decorator so we can implement Angular interfaces
export class OrderPrintPageBaseComponent extends OrderPageBaseComponent {

	protected consignee?: IOrderCounterparty;
	protected carrier?: IOrderCounterparty;

	constructor(
		className: string,
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		orderService: FreightOrdersService,
	) {
		super(className, route, teamParams, orderService);
	}

	protected override onOrderChanged(order: IExpressOrderContext): void {
		super.onOrderChanged(order);
		console.log('OrderShippingDocComponent.onOrderChanged()', order);
		this.consignee = order.dto?.counterparties?.find(c => c.role === 'consignee');
		this.carrier = order.dto?.counterparties?.find(c => c.role === 'carrier');
	}
}
