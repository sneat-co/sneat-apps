import { Directive, Inject, InjectionToken } from '@angular/core';
import { SpaceBaseComponent } from '@sneat/team-components';
import { ILogistOrderContext } from '../dto';
import { LogistOrderService } from '../services';

@Directive() // we need this decorator so we can implement Angular interfaces
export class OrderPageBaseComponent extends SpaceBaseComponent {
	protected order?: ILogistOrderContext;
	numberOfDispatchers?: number;

	constructor(
		@Inject(new InjectionToken('className')) className: string,
		private readonly orderService: LogistOrderService,
	) {
		super(className);
		this.route.paramMap.pipe(this.takeUntilDestroyed()).subscribe((params) => {
			this.order = {
				id: params.get('orderID') || '',
				space: { id: params.get('spaceID') || '' },
			};
			if (this.space?.id && this.order?.id) {
				this.orderService
					.watchOrderByID(this.space.id, this.order.id)
					.subscribe({
						next: (order) => {
							this.setOrder(order);
							this.order = order;
						},
						error: this.errorLogger.logErrorHandler('failed to load order'),
					});
			}
		});
	}

	private setOrder(order: ILogistOrderContext): void {
		this.order = order;
		console.log('setOrder', order);
		this.numberOfDispatchers = order?.dbo?.counterparties?.filter(
			(c) => c.role === 'dispatcher',
		).length;
		this.onOrderChanged(order);
	}

	protected onOrderChanged(order: ILogistOrderContext): void {
		// override this method to handle order changes
		console.log('onOrderChanged', order);
	}
}
