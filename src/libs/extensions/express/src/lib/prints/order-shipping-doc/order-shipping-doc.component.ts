import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { ExpressOrderService,  } from '../..';
import { OrderPrintPageBaseComponent } from '../order-print-page-base.component';

@Component({
	selector: 'sneat-express-order-print-shipping-doc',
	templateUrl: './order-shipping-doc.component.html',
})
export class OrderShippingDocComponent extends OrderPrintPageBaseComponent {

	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		orderService: ExpressOrderService,
	) {
		super('OrderShippingDocComponent', route, teamParams, orderService);
	}
}
