import { ChangeDetectorRef, Component, inject } from '@angular/core';
import {
	IonBackButton,
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonLabel,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { excludeEmpty } from '@sneat/core';
import { SpaceBaseComponent } from '@sneat/space-components';
import { ClassName } from '@sneat/ui';
import { Subscription, takeUntil } from 'rxjs';
import { OrdersGridComponent } from '../../components/orders-grid/orders-grid.component';
import { OrdersListComponent } from '../../components/orders-list/orders-list.component';
import { ILogistOrderContext, IOrdersFilter } from '../../dto';
import { LogistOrderService } from '../../services';
import { OrdersFilterComponent } from './orders-filter/orders-filter.component';

const defaultFilter: IOrdersFilter = { status: 'active' };

@Component({
	selector: 'sneat-logist-orders-page',
	templateUrl: 'logist-orders-page.component.html',
	imports: [
		IonHeader,
		IonToolbar,
		IonButtons,
		IonBackButton,
		IonTitle,
		IonButton,
		IonIcon,
		IonLabel,
		IonContent,
		OrdersFilterComponent,
		OrdersGridComponent,
		OrdersListComponent,
	],
	providers: [{ provide: ClassName, useValue: 'OrdersPageComponent' }],
})
export class LogistOrdersPageComponent extends SpaceBaseComponent {
	private readonly ordersService = inject(LogistOrderService);
	private readonly changeDetectorRef = inject(ChangeDetectorRef);

	orders?: ILogistOrderContext[];

	private ordersSubscription?: Subscription;
	private filter: IOrdersFilter = defaultFilter;

	protected viewMode: 'list' | 'grid' = 'grid';

	public constructor() {
		super();
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
