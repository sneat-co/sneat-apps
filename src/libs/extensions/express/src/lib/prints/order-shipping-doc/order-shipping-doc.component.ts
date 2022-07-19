import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { FreightOrdersService, IExpressOrderContext, IOrderCounterparty, IOrderShippingPointCounterparty } from '../..';
import { OrderPageBaseComponent } from '../../pages/order-page-base.component';

@Component({
	selector: 'sneat-express-order-print-shipping-doc',
	templateUrl: './order-shipping-doc.component.html',
})
export class OrderShippingDocComponent extends OrderPageBaseComponent {

	consignee?: IOrderCounterparty;

	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		orderService: FreightOrdersService,
	) {
		super('OrderShippingDocComponent', route, teamParams, orderService);
	}


	protected override onOrderChanged(order: IExpressOrderContext): void {
		super.onOrderChanged(order);
		console.log('OrderShippingDocComponent.onOrderChanged()', order);
		this.consignee = order.dto?.counterparties?.find(c => c.role === 'consignee');
	}

}
