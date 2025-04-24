import { Component } from '@angular/core';
import {
	IonBackButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { LogistOrderService } from '../../services';
import { OrderPageBaseComponent } from '../order-page-base.component';

@Component({
	selector: 'sneat-logist-new-shipping-point',
	templateUrl: './new-shipping-point-page.component.html',
	imports: [
		IonHeader,
		IonToolbar,
		IonButtons,
		IonBackButton,
		IonTitle,
		IonContent,
	],
})
export class NewShippingPointPageComponent extends OrderPageBaseComponent {
	constructor(
		orderService: LogistOrderService,
		// private readonly orderNavService: OrderNavService,
	) {
		super('NewShippingPointPageComponent', orderService);
	}
}
