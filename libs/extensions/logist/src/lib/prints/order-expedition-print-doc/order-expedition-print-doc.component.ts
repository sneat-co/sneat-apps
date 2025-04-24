import { Component } from '@angular/core';
import {
	IonCard,
	IonCol,
	IonGrid,
	IonInput,
	IonItem,
	IonLabel,
	IonRow,
} from '@ionic/angular/standalone';
import { LogistOrderService } from '../../services';
import { OrderPrintPageBaseComponent } from '../order-print-page-base.component';

@Component({
	selector: 'sneat-logist-order-print-shipping-doc',
	templateUrl: './order-expedition-print-doc.component.html',
	imports: [IonCard, IonRow, IonCol, IonItem, IonLabel, IonInput, IonGrid],
})
export class OrderExpeditionPrintDocComponent extends OrderPrintPageBaseComponent {
	constructor(orderService: LogistOrderService) {
		super('OrderShippingDocComponent', orderService);
	}
}
