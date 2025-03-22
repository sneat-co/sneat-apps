import { Component } from '@angular/core';
import { LogistOrderService, OrderNavService } from '../../services';
import { OrderPageBaseComponent } from '../order-page-base.component';

@Component({
	selector: 'sneat-new-segment-page',
	templateUrl: 'new-segment-page.component.html',
	standalone: false,
})
export class NewSegmentPageComponent extends OrderPageBaseComponent {
	constructor(
		orderService: LogistOrderService,
		private readonly orderNavService: OrderNavService,
	) {
		super('NewSegmentPageComponent', orderService);
	}

	back(): void {
		this.navController
			.pop()
			.catch(this.errorLogger.logErrorHandler('Failed to navigate back'));
	}
}
