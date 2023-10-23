import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamComponentBaseParams } from '@sneat/team-components';
import { LogistOrderService, OrderNavService } from '../../services';
import { OrderPageBaseComponent } from '../order-page-base.component';

@Component({
	selector: 'sneat-new-segment-page',
	templateUrl: 'new-segment-page.component.html',
})
export class NewSegmentPageComponent extends OrderPageBaseComponent {
	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		orderService: LogistOrderService,
		private readonly orderNavService: OrderNavService,
	) {
		super('NewSegmentPageComponent', route, teamParams, orderService);
	}

	back(): void {
		this.navController
			.pop()
			.catch(this.errorLogger.logErrorHandler('Failed to navigate back'));
	}
}
