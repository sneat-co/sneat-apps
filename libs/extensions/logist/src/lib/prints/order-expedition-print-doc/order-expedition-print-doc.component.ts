import { Component } from '@angular/core';
import { LogistOrderService } from '../../services';
import { OrderPrintPageBaseComponent } from '../order-print-page-base.component';

@Component({
	selector: 'sneat-logist-order-print-shipping-doc',
	templateUrl: './order-expedition-print-doc.component.html',
	standalone: false,
})
export class OrderExpeditionPrintDocComponent extends OrderPrintPageBaseComponent {
	constructor(orderService: LogistOrderService) {
		super('OrderShippingDocComponent', orderService);
	}
}
