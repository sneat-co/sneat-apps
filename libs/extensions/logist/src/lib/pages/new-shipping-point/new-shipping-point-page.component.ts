import { Component } from '@angular/core';
import { LogistOrderService } from '../../services';
import { OrderPageBaseComponent } from '../order-page-base.component';

@Component({
	selector: 'sneat-logist-new-shipping-point',
	templateUrl: './new-shipping-point-page.component.html',
	standalone: false,
})
export class NewShippingPointPageComponent extends OrderPageBaseComponent {
	constructor(
		orderService: LogistOrderService,
		// private readonly orderNavService: OrderNavService,
	) {
		super('NewShippingPointPageComponent', orderService);
	}
}
