import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { LogistOrderService } from '../..';
import { OrderPrintPageBaseComponent } from '../order-print-page-base.component';

@Component({
	selector: 'sneat-logist-order-print-shipping-doc',
	templateUrl: './order-expedition-print-doc.component.html',
})
export class OrderExpeditionPrintDocComponent extends OrderPrintPageBaseComponent {

	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		orderService: LogistOrderService,
	) {
		super('OrderShippingDocComponent', route, teamParams, orderService);
	}



}
