import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamComponentBaseParams } from '@sneat/team-components';
import { LogistOrderService, OrderNavService } from '../../services';
import { OrderPageBaseComponent } from '../order-page-base.component';

@Component({
	selector: 'sneat-logist-new-shipping-point',
	templateUrl: './new-shipping-point-page.component.html',
})
export class NewShippingPointPageComponent extends OrderPageBaseComponent {
	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		orderService: LogistOrderService,
		private readonly orderNavService: OrderNavService,
	) {
		super('NewShippingPointPageComponent', route, teamParams, orderService);
	}
}
