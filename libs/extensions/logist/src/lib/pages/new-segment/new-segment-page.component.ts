import { Component, inject } from '@angular/core';
import {
	IonBackButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { NewSegmentFormComponent } from '../../components/new-segment';
import { LogistOrderService, OrderNavService } from '../../services';
import { OrderPageBaseComponent } from '../order-page-base.component';

@Component({
	selector: 'sneat-new-segment-page',
	templateUrl: 'new-segment-page.component.html',
	imports: [
		IonHeader,
		IonToolbar,
		IonButtons,
		IonBackButton,
		IonTitle,
		IonContent,
		NewSegmentFormComponent,
	],
})
export class NewSegmentPageComponent extends OrderPageBaseComponent {
	private readonly orderNavService = inject(OrderNavService);

	constructor() {
		const orderService = inject(LogistOrderService);

		super('NewSegmentPageComponent', orderService);
	}

	back(): void {
		this.navController
			.pop()
			.catch(this.errorLogger.logErrorHandler('Failed to navigate back'));
	}
}
