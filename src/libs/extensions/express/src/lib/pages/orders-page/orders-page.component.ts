import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FreightOrdersService } from '../../services/freight-orders.service';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';
import { IExpressOrderContext } from '../../dto/order';

@Component({
	selector: 'sneat-orders-page',
	templateUrl: 'orders-page.component.html',
})
export class OrdersPageComponent extends TeamBaseComponent {
	type?: 'export' | 'import' | 'internal' | '';
	status: 'active' | 'complete' | 'canceled' = 'active';
	counterparty = '';
	carrier = '';
	shipper = '';
	countryOrigin = '';
	countryDestination = '';

	orders?: IExpressOrderContext[];

	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		private readonly ordersService: FreightOrdersService,
	) {
		super('OrdersPageComponent', route, teamParams);
	}

	protected override onTeamIdChanged() {
		super.onTeamIdChanged();
		if (this.team.id) {
			this.ordersService.watchFreightOrders(this.team.id).subscribe({
				next: orders => {
					console.log('express_orders', orders);
					this.orders = orders;
				},
				error: this.errorLogger.logErrorHandler('faield to load express orders'),
			});
		}
	}
}
