import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';
import { ICreateExpressOrderRequest, IExpressOrderContext } from '../../dto/order-dto';
import { FreightOrdersService } from '../../services/freight-orders.service';

@Component({
	selector: 'sneat-new-express-order-page',
	templateUrl: 'new-express-order-page.component.html',
})
export class NewExpressOrderPageComponent extends TeamBaseComponent {
	public order: IExpressOrderContext = {
		id: '',
		dto: {
			status: 'draft',
			direction: 'export',
			route: {
				origin: { id: 'origin', countryID: '' },
				destination: { id: 'destination', countryID: '' },
			},
		},
	};

	readonly = false;

	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		private readonly freightOrdersService: FreightOrdersService,
	) {
		super('NewExpressOrderPageComponent', route, teamParams);
		console.log('NewExpressOrderPageComponent');
	}

	onOrderChanged(order: IExpressOrderContext): void {
		console.log('NewExpressOrderPageComponent.onOrderChanged():', order);
		this.order = order;
	}

	createOrder(): void {
		if (!this.team?.id) {
			throw new Error('no team context');
		}
		if (!this.order?.dto) {
			throw new Error('!this.order?.dto');
		}
		const request: ICreateExpressOrderRequest = {
			teamID: this.team.id,
			order: this.order.dto,
		};
		this.freightOrdersService.createOrder(request).subscribe({
			next: response => {
				console.log('order created:', response);
				this.navController.navigateRoot(['..', 'order', response.order.id], { relativeTo: this.route })
					.catch(this.errorLogger.logErrorHandler('failed to navigate to order'));
			},
			error: this.errorLogger.logErrorHandler('failed to create new order'),
		});
	}

	cancel(): void {
		this.navController.pop().catch(this.errorLogger.logErrorHandler('failed to cancel new order'));
	}
}
