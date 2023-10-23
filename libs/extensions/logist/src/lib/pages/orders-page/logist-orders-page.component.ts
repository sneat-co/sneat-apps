import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { excludeEmpty } from '@sneat/core';
import {
	TeamBaseComponent,
	TeamComponentBaseParams,
} from '@sneat/team-components';
import { Subscription, takeUntil } from 'rxjs';
import { ILogistOrderContext } from '../../dto/order-dto';
import { LogistOrderService } from '../../services/logist-order.service';
import { IOrdersFilter } from '../../dto/orders-filter';

const defaultFilter: IOrdersFilter = { status: 'active' };

@Component({
	selector: 'sneat-logist-orders-page',
	templateUrl: 'logist-orders-page.component.html',
	// changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogistOrdersPageComponent extends TeamBaseComponent {
	orders?: ILogistOrderContext[];

	private ordersSubscription?: Subscription;
	private filter: IOrdersFilter = defaultFilter;

	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		private readonly ordersService: LogistOrderService,
		private readonly changeDetectorRef: ChangeDetectorRef,
	) {
		super('OrdersPageComponent', route, teamParams);
	}

	protected override onTeamIdChanged() {
		super.onTeamIdChanged();
		if (this.team?.id) {
			this.subscribeForOrders();
		}
	}

	protected onFilterChanged(filter: IOrdersFilter) {
		console.log('onFilterChanged()', filter);
		this.filter = filter;
		this.subscribeForOrders();
	}

	private subscribeForOrders() {
		try {
			this.ordersSubscription?.unsubscribe();
			this.orders = undefined;
			const teamId = this.team?.id;
			if (!teamId) {
				throw new Error('Team ID is not defined');
			}
			this.ordersSubscription = this.ordersService
				.watchFreightOrders(teamId, excludeEmpty(this.filter))
				.pipe(takeUntil(this.destroyed))
				.subscribe({
					next: (orders) => {
						console.log(
							'LogistOrdersPageComponent.subscribeForOrders() => orders:',
							orders,
						);
						this.orders = orders;
						this.changeDetectorRef.detectChanges();
					},
					error: this.errorLogger.logErrorHandler(
						'failed to load logist orders',
					),
				});
		} catch (e) {
			this.errorLogger.logError(e, 'failed to subscribeForOrders for orders');
		}
	}
}
