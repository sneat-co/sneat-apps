import { Directive, Inject, InjectionToken } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';
import {
	ILogistOrderContext,
} from '../dto';
import { LogistOrderService } from '../services';

@Directive() // we need this decorator so we can implement Angular interfaces
export class OrderPageBaseComponent extends TeamBaseComponent {
	protected order?: ILogistOrderContext;
	numberOfDispatchers?: number;

	constructor(
		@Inject(new InjectionToken('className')) className: string,
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		private readonly orderService: LogistOrderService,
	) {
		super(className, route, teamParams);
		route.paramMap
			// .pipe(
			// 	takeUntil(this.destroyed),
			// )
			.subscribe(params => {
				this.order = { id: params.get('orderID') || '', team: { id: params.get('teamID') || '' } };
				if (this.team?.id && this.order?.id) {
					this.orderService
						.watchOrderByID(this.team.id, this.order.id)
						.subscribe({
							next: order => {
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
		this.numberOfDispatchers = order?.dto?.counterparties?.filter(c => c.role === 'dispatcher').length;
		this.onOrderChanged(order);
	}

	protected onOrderChanged(order: ILogistOrderContext): void {
		// override this method to handle order changes
		console.log('onOrderChanged', order);
	}
}
