import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FreightOrdersService } from '@sneat/extensions/express';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';
import { ICreateFreightOrderRequest, IFreightOrderDto } from '../../dto/order';

@Component({
	selector: 'sneat-new-express-order-page',
	templateUrl: 'new-express-order-page.component.html',
})
export class NewExpressOrderPageComponent extends TeamBaseComponent {
	public order: IFreightOrderDto = {
		status: 'draft',
		direction: 'export',
	};

	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		private readonly freightOrdersService: FreightOrdersService
	) {
		super('NewExpressOrderPageComponent', route, teamParams);
		console.log('NewExpressOrderPageComponent');
	}

	createOrder(): void {
		if (!this.team?.id) {
			throw new Error('no team context');
			return;
		}
		const request: ICreateFreightOrderRequest = {
			teamID: this.team.id,
			order: this.order,
		};
		this.freightOrdersService.createOrder(request).subscribe({
			next: response => {
				console.log('order created:', response)
			},
			error: this.errorLogger.logErrorHandler('failed to create new order'),
		})
	}
}
