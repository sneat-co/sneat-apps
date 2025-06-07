import { Component, inject } from '@angular/core';
import {
	IonBackButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { ClassName } from '@sneat/ui';
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
	providers: [{ provide: ClassName, useValue: 'NewSegmentPageComponent' }],
})
export class NewSegmentPageComponent extends OrderPageBaseComponent {
	private readonly orderNavService = inject(OrderNavService);

	public constructor() {
		const orderService = inject(LogistOrderService);

		super(orderService);
	}

	back(): void {
		this.navController
			.pop()
			.catch(this.errorLogger.logErrorHandler('Failed to navigate back'));
	}
}
