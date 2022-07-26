import { Directive, Inject, Injectable, InjectionToken } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FreightOrdersService, IExpressOrderContext } from '../..';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';

@Directive() // we need this decorator so we can implement Angular interfaces
export class OrderPageBaseComponent extends TeamBaseComponent {
	protected order?: IExpressOrderContext;

	constructor(
		@Inject(new InjectionToken('className')) className: string,
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		private readonly orderService: FreightOrdersService,
	) {
		super(className, route, teamParams);
		route.paramMap
			// .pipe(
			// 	takeUntil(this.destroyed),
			// )
			.subscribe(params => {
				this.order = { id: params.get('orderID') || '', team: {id: params.get('teamID') || ''} };
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

	private setOrder(order: IExpressOrderContext): void {
		this.order = order;
		this.onOrderChanged(order);
	}

	protected onOrderChanged(order: IExpressOrderContext): void {
		// override this method to handle order changes
	}
}
