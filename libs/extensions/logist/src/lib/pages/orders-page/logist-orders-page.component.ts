import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { excludeEmpty } from '@sneat/core';
import {
	SpaceBaseComponent,
	SpaceComponentBaseParams,
} from '@sneat/team-components';
import { Subscription, takeUntil } from 'rxjs';
import { ILogistOrderContext, IOrdersFilter } from '../../dto';
import { LogistOrderService } from '../../services';

const defaultFilter: IOrdersFilter = { status: 'active' };

@Component({
	selector: 'sneat-logist-orders-page',
	templateUrl: 'logist-orders-page.component.html',
	// changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogistOrdersPageComponent extends SpaceBaseComponent {
	orders?: ILogistOrderContext[];

	private ordersSubscription?: Subscription;
	private filter: IOrdersFilter = defaultFilter;

	protected viewMode: 'list' | 'grid' = 'grid';

	constructor(
		route: ActivatedRoute,
		teamParams: SpaceComponentBaseParams,
		private readonly ordersService: LogistOrderService,
		private readonly changeDetectorRef: ChangeDetectorRef,
	) {
		super('OrdersPageComponent', route, teamParams);
	}

	protected override onSpaceIdChanged() {
		super.onSpaceIdChanged();
		if (this.space?.id) {
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
			const spaceID = this.space?.id;
			if (!spaceID) {
				throw new Error('Space ID is not defined');
			}
			this.ordersSubscription = this.ordersService
				.watchFreightOrders(spaceID, excludeEmpty(this.filter))
				.pipe(takeUntil(this.destroyed$))
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
