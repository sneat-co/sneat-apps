import { NgForOf } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
	IonCard,
	IonCardContent,
	IonCol,
	IonGrid,
	IonInput,
	IonItem,
	IonItemDivider,
	IonLabel,
	IonRow,
} from '@ionic/angular/standalone';
import { ClassName } from '@sneat/ui';
import { LogistOrderService } from '../../services';
import { OrderPrintPageBaseComponent } from '../order-print-page-base.component';

@Component({
	selector: 'sneat-logist-order-print-shipping-doc',
	templateUrl: './order-shipping-doc.component.html',
	imports: [
		IonGrid,
		IonRow,
		IonCol,
		IonCard,
		IonCardContent,
		IonInput,
		IonItem,
		IonLabel,
		IonItemDivider,
	],
	providers: [{ provide: ClassName, useValue: 'OrderShippingDocComponent' }],
})
export class OrderShippingDocComponent extends OrderPrintPageBaseComponent {
	public constructor() {
		super(inject(LogistOrderService));
	}
}
