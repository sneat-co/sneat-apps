import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { excludeUndefined } from '@sneat/core';
import { IContactContext } from '@sneat/contactus-core';
import { first, takeUntil } from 'rxjs';
import { ISelectItem } from '@sneat/components';
import {
	TeamBaseComponent,
	TeamComponentBaseParams,
} from '@sneat/team-components';
import {
	CounterpartyRole,
	IOrderCounterparty,
	OrderDirection,
} from '../../dto';
import {
	ICreateLogistOrderRequest,
	ILogistOrderContext,
} from '../../dto/order-dto';
import { LogistOrderService, LogistTeamService } from '../../services';

@Component({
	selector: 'sneat-new-logist-order-page',
	templateUrl: 'new-logist-order-page.component.html',
})
export class NewLogistOrderPageComponent extends TeamBaseComponent {
	public order: ILogistOrderContext = {
		id: '',
		team: this.team || { id: '', type: 'company' },
		dto: {
			status: 'draft',
			direction: 'export',
			createdAt: { seconds: 0, nanoseconds: 0 },
			createdBy: '',
			updatedAt: { seconds: 0, nanoseconds: 0 },
			updatedBy: '',
			// route: {
			// 	origin: { id: 'origin', countryID: '' },
			// 	destination: { id: 'destination', countryID: '' },
			// },
		},
	};

	protected direction?: OrderDirection;

	protected readonly directions: ISelectItem[] = [
		{ id: 'export', title: 'Export' },
		{ id: 'import', title: 'Import' },
		{ id: 'internal', title: 'Internal' },
	];

	private numberOfContainers: Record<string, number> = {};

	readonly = false;

	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		private readonly freightOrdersService: LogistOrderService,
		private readonly logistTeamService: LogistTeamService,
	) {
		super('NewLogistOrderPageComponent', route, teamParams);
	}

	get formIsValid(): boolean {
		return (
			!!this.order.dto?.route?.origin?.countryID &&
			!!this.order.dto?.route?.destination?.countryID
		);
	}

	protected override onTeamIdChanged() {
		super.onTeamIdChanged();
		if (!this.team?.id) {
			return;
		}
		this.logistTeamService
			.watchLogistTeamByID(this.team.id)
			.pipe(this.takeUntilNeeded(), takeUntil(this.teamIDChanged$))
			.subscribe({
				next: (logistTeam) => {
					if (logistTeam.dto?.contactID) {
						this.loadTeamContact(logistTeam.dto.contactID);
					}
				},
				error: this.errorLogger.logErrorHandler(
					'failed to load logist module record',
				),
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
				error: this.errorLogger.logErrorHandler(
					'failed to load logist team default contact',
				),
			});
	}

	private readonly processTeamContact = (contact: IContactContext): void => {
		console.log('contact:', contact);
		const contactDto = contact.dto;
		if (!contactDto) {
			return;
		}
		const orderDto = this.order.dto;
		if (!orderDto) {
			return;
		}

		contact.dto.roles?.forEach((role) => {
			const orderCounterparty: IOrderCounterparty = {
				contactID: contact.id,
				title: contactDto.title || contact.id,
				countryID: contactDto.countryID || '',
				address: contactDto.address,
				role: role as CounterpartyRole,
			};
			this.order = {
				...this.order,
				dto: {
					...orderDto,
					counterparties: [
						...(orderDto.counterparties || []),
						orderCounterparty,
					],
				},
			};
		});
	};

	onOrderChanged(order: ILogistOrderContext): void {
		console.log('NewLogistOrderPageComponent.onOrderChanged():', order);
		this.order = order;
	}

	onNumberOfContainersChanged(v: Record<string, number>): void {
		console.log(
			'NewLogistOrderPageComponent.onNumberOfContainersChanged():',
			v,
		);
		this.numberOfContainers = v;
	}

	createOrder(): void {
		if (!this.team?.id) {
			throw new Error('no team context');
		}
		if (!this.order?.dto) {
			throw new Error('!this.order?.dto');
		}
		if (!this.order?.dto?.counterparties?.some((c) => c.role === 'buyer')) {
			alert('Buyer is required');
			return;
		}

		if (!Object.keys(this.numberOfContainers).length) {
			console.error('No containers', this.numberOfContainers);
			alert('No containers');
			return;
		}

		// if (!this.order?.dto?.counterparties?.some(c => c.role === 'dispatcher')) {
		// 	alert('At least 1 dispatcher is required');
		// 	return;
		// }
		// if (!this.order?.dto?.route?.origin?.countryID) {
		// 	alert('Origin country is required');
		// 	return;
		// }
		// if (!this.order?.dto?.route?.destination?.countryID) {
		// 	alert('Destination country is required');
		// 	return;
		// }
		if (!this.direction) {
			alert('Direction is required');
			return;
		}
		const request: ICreateLogistOrderRequest = excludeUndefined({
			teamID: this.team.id,
			order: {
				...this.order.dto,
				direction: this.direction,
				route: undefined, //TODO: decide what to do //Object.keys(this.order?.dto?.route || {}).length ? this.order.dto.route : undefined,
			},
			numberOfContainers: Object.keys(this.numberOfContainers).length
				? this.numberOfContainers
				: undefined,
		});

		this.freightOrdersService.createOrder(request).subscribe({
			next: (response) => {
				console.log('order created:', response);
				this.navController
					.navigateRoot(['..', 'order', response.order.id], {
						relativeTo: this.route,
					})
					.catch(
						this.errorLogger.logErrorHandler('failed to navigate to order'),
					);
			},
			error: this.errorLogger.logErrorHandler('failed to create new order'),
		});
	}

	cancel(): void {
		this.navController
			.pop()
			.catch(this.errorLogger.logErrorHandler('failed to cancel new order'));
	}

	protected onCounterpartiesAdded(counterparties: IOrderCounterparty[]): void {
		console.log(
			'NewLogistOrderPageComponent.onCounterpartiesAdded():',
			counterparties,
		);
		const orderDto = this.order.dto;
		if (!orderDto) {
			return;
		}
		const orderCounterparties = orderDto.counterparties || [];
		counterparties = counterparties.filter(
			(c) =>
				!orderCounterparties?.some(
					(oc) => oc.contactID === c.contactID && oc.role === c.role,
				),
		);
		this.order = {
			...this.order,
			dto: {
				...orderDto,
				counterparties: [...orderCounterparties, ...counterparties],
			},
		};
		console.log(
			'NewLogistOrderPageComponent.onCounterpartiesAdded() =>',
			this.order,
		);
	}
}
