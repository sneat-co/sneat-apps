import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { excludeEmpty } from '@sneat/core';
import { Subscription, takeUntil } from 'rxjs';
import { ExpressOrderService } from '../../services/express-order.service';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';
import { IExpressOrderContext } from '../../dto/order-dto';
import { IOrdersFilter } from '../../services/orders-filter';

@Component({
	selector: 'sneat-express-orders-page',
	templateUrl: 'express-orders-page.component.html',
})
export class ExpressOrdersPageComponent extends TeamBaseComponent {

	orders?: IExpressOrderContext[];

	private ordersSubscription?: Subscription;
	private filter?: IOrdersFilter;

	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		private readonly ordersService: ExpressOrderService,
	) {
		super('OrdersPageComponent', route, teamParams);
	}

	protected override onTeamIdChanged() {
		super.onTeamIdChanged();
		if (this.team.id) {
			this.subscribeForOrders();
		}
	}

	protected onFilterChanged(filter: IOrdersFilter) {
		console.log('onFilterChanged()', filter);
		this.filter = filter;
		this.subscribeForOrders();
	}

	private subscribeForOrders() {
		this.ordersSubscription?.unsubscribe();
		this.ordersSubscription = this.ordersService
			.watchFreightOrders(this.team.id, excludeEmpty(this.filter))
			.pipe(
				takeUntil(this.destroyed),
			)
			.subscribe({
				next: orders => {
					console.log('express_orders', orders);
					this.orders = orders;
				},
				error: this.errorLogger.logErrorHandler('faield to load express orders'),
			});
	}

}
