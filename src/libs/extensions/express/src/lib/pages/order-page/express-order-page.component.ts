import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FreightOrdersService } from '@sneat/extensions/express';
import { takeUntil } from 'rxjs';
import { IExpressOrderContext } from '../../dto';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';

@Component({
	selector: 'sneat-order-page',
	templateUrl: './express-order-page.component.html',
	styleUrls: ['./express-order-page.component.scss'],
})
export class ExpressOrderPageComponent extends TeamBaseComponent {
	tab: 'containers' | 'notes' = 'containers';

	order?: IExpressOrderContext;

	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		private readonly orderService: FreightOrdersService,
	) {
		super('OrderPageComponent', route, teamParams);
		route.paramMap
			// .pipe(
			// 	takeUntil(this.destroyed),
			// )
			.subscribe(params => {
				this.order = { id: params.get('orderID') || '' };
				if (this.team?.id && this.order?.id) {
					this.orderService
						.watchOrderByID(this.team.id, this.order.id)
						.subscribe({
							next: order => {
								this.order = order;
							},
							error: this.errorLogger.logErrorHandler('failed to load order'),
						})
				}
			});
	}
}
