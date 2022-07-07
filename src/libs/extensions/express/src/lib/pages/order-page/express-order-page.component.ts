import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { FreightOrdersService } from '../..';
import { OrderPageBaseComponent } from '../order-page-base.component';

@Component({
	selector: 'sneat-order-page',
	templateUrl: './express-order-page.component.html',
	styleUrls: ['./express-order-page.component.scss'],
})
export class ExpressOrderPageComponent extends OrderPageBaseComponent {
	tab: 'load_points' | 'containers' | 'notes' = 'load_points';

	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		orderService: FreightOrdersService,
	) {
		super('OrderPageComponent', route, teamParams, orderService);
	}
}
