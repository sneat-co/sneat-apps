import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContactRoleExpress } from '@sneat/dto';
import { ContactService } from '@sneat/extensions/contactus';
import { first, NEVER, switchMap, takeUntil } from 'rxjs';
import { ExpressTeamService, FreightOrdersService, IOrderCounterparty } from '../..';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';
import { ICreateExpressOrderRequest, IExpressOrderContext } from '../../dto/order-dto';

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
		private readonly expressTeamService: ExpressTeamService,
		private readonly contactService: ContactService,
	) {
		super('NewExpressOrderPageComponent', route, teamParams);
		console.log('NewExpressOrderPageComponent');
	}

	protected override onTeamIdChanged() {
		super.onTeamIdChanged();
		if (!this.team?.id) {
			return;
		}
		this.expressTeamService
			.watchExpressTeamByID(this.team.id)
			.pipe(
				this.takeUntilNeeded(),
				takeUntil(this.teamIDChanged$),
				switchMap(expressTeam => {
					console.log('expressTeam:', expressTeam);
					return !expressTeam.dto ? NEVER
						: this.contactService
							.watchById(this.team.id, expressTeam.dto.contactID)
							.pipe(first());
				}),
			).subscribe({
			next: contact => {
				console.log('contact:', contact);
				if (!contact.dto) {
					return;
				}
				const orderCounterparty: IOrderCounterparty = {
					contactID: contact.id,
					title: contact.dto.title || contact.id,
					countryID: contact.dto.countryID || '',
					address: contact.dto.address,
					role: contact.dto?.roles?.length ? contact.dto.roles[0] as ContactRoleExpress : 'carrier',
				};
				console.log('order: 1', this.order);
				if (this.order?.dto) {
					this.order = {
						...this.order,
						dto: {
							...this.order.dto,
							counterparties: [...this.order.dto.counterparties || [], orderCounterparty],
						},
					};
				}
				console.log('order: 2', this.order);
			},
			error: this.errorLogger.logErrorHandler('failed to load contact'),
		});
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
