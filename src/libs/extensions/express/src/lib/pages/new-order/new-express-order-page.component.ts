import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContactService } from '@sneat/extensions/contactus';
import { IContactContext } from '@sneat/team/models';
import { first, takeUntil } from 'rxjs';
import {
	CounterpartyRole,
	ExpressTeamService,
	ExpressOrderService,
	IOrderCounterparty,
} from '../..';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';
import { ICreateExpressOrderRequest, IExpressOrderContext } from '../../dto/order-dto';

@Component({
	selector: 'sneat-new-express-order-page',
	templateUrl: 'new-express-order-page.component.html',
})
export class NewExpressOrderPageComponent extends TeamBaseComponent {
	public order: IExpressOrderContext = {
		id: '',
		team: this.team || {id: '', type: 'company'},
		dto: {
			status: 'draft',
			direction: 'export',
			created: {at: {seconds: 0, nanoseconds: 0}, by: ''},
			updated: {at: {seconds: 0, nanoseconds: 0}, by: ''},
			// route: {
			// 	origin: { id: 'origin', countryID: '' },
			// 	destination: { id: 'destination', countryID: '' },
			// },
		},
	};

	private numberOfContainers: {[size: string]: number} = {};

	readonly = false;

	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		private readonly freightOrdersService: ExpressOrderService,
		private readonly expressTeamService: ExpressTeamService,
		private readonly contactService: ContactService,
	) {
		super('NewExpressOrderPageComponent', route, teamParams);
		console.log('NewExpressOrderPageComponent');
	}

	get formIsValid(): boolean {
		return !!this.order.dto?.route?.origin?.countryID
			&& !!this.order.dto?.route?.destination?.countryID;
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
			).subscribe({
			next: expressTeam => {
				if (expressTeam.dto?.contactID) {
					this.loadTeamContact(expressTeam.dto.contactID);
				}
			},
			error: this.errorLogger.logErrorHandler('failed to load express module record'),
		});
	}

	private loadTeamContact(contactID: string): void {
		const team = this.team;
		if (!team) {
			throw new Error('No team context');
		}
		this.contactService
			.watchContactById(team, contactID)
			.pipe(first())
			.subscribe({
				next: this.processTeamContact,
				error: this.errorLogger.logErrorHandler('failed to load express team default contact'),
			});
	}

	private readonly processTeamContact = (contact: IContactContext): void => {
		console.log('contact:', contact);
		if (!contact.dto) {
			return;
		}
		const orderCounterparty: IOrderCounterparty = {
			contactID: contact.id,
			title: contact.dto.title || contact.id,
			countryID: contact.dto.countryID || '',
			address: contact.dto.address,
			role: contact.dto?.roles?.length ? contact.dto.roles[0] as CounterpartyRole : 'carrier',
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
	};

	onOrderChanged(order: IExpressOrderContext): void {
		console.log('NewExpressOrderPageComponent.onOrderChanged():', order);
		this.order = order;
	}


	onNumberOfContainersChanged(v: {[size: string]: number}): void {
		console.log('NewExpressOrderPageComponent.onNumberOfContainersChanged():', v);
		this.numberOfContainers = v;
	}

	createOrder(): void {
		if (!this.team?.id) {
			throw new Error('no team context');
		}
		if (!this.order?.dto) {
			throw new Error('!this.order?.dto');
		}
		if (!this.order?.dto?.counterparties?.some(c => c.role === 'carrier')) {
			alert('Carrier is required');
			return;
		}
		if (!this.order?.dto?.counterparties?.some(c => c.role === 'buyer')) {
			alert('Buyer is required');
			return;
		}

		if (!this.order?.dto?.counterparties?.some(c => c.role === 'dispatcher')) {
			alert('At least 1 dispatcher is required');
			return;
		}
		// if (!this.order?.dto?.route?.origin?.countryID) {
		// 	alert('Origin country is required');
		// 	return;
		// }
		// if (!this.order?.dto?.route?.destination?.countryID) {
		// 	alert('Destination country is required');
		// 	return;
		// }
		const request: ICreateExpressOrderRequest = {
			teamID: this.team.id,
			order: {
				...this.order.dto,
				route: Object.keys(this.order?.dto?.route || {}).length ? this.order.dto.route : undefined,
			},
			numberOfContainers: Object.keys(this.numberOfContainers).length ? this.numberOfContainers : undefined,
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
