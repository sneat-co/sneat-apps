import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ContactSelectorService, IContactSelectorOptions } from '@sneat/extensions/contactus';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team/models';
import {
	FreightOrdersService,
	IAddOrderShippingPointRequest,
	IDeleteCounterpartyRequest,
	IExpressOrderContext, IOrderCounterparty,
	IOrderShippingPointCounterparty,
} from '../..';

interface ICounterparty extends IOrderCounterparty {
	parent?: IOrderCounterparty;
}

@Component({
	selector: 'sneat-express-order-counterparties',
	templateUrl: './order-counterparties.component.html',
})
export class OrderCounterpartiesComponent implements OnChanges {
	@Input() team?: ITeamContext;
	@Input() order?: IExpressOrderContext;
	@Output() readonly orderChange = new EventEmitter<IExpressOrderContext>();
	@Input() readonly = false;
	@Input() plural = 'plural TO BE SET';
	@Input() singular = 'singular TO BE SET';
	@Input() parentRole?: 'dispatcher' = 'dispatcher';
	@Input() contactRole: 'location'  = 'location';

	readonly deleting: IOrderShippingPointCounterparty[] = [];

	public counterparties?: ICounterparty[];

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly contactSelectorService: ContactSelectorService,
		private readonly ordersService: FreightOrdersService,
	) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['order']) {
			this.setCounterparties();
		}
	}

	private setCounterparties(): void {
		const counterparties = this.order?.dto?.counterparties || [];

		this.counterparties = counterparties.filter(c => c.role === this.contactRole)
			.map(c => c.parentContactID ? {
				...c,
				parent: counterparties.find(cc => cc.contactID === c.parentContactID),
			} : c);
	}

	addCounterparty(event: Event): void {
		console.log('addCounterparty(), event:', event);
		event.stopPropagation();
		event.preventDefault();
		const team = this.team;
		if (!team) {
			this.errorLogger.logError('ContactInputComponent.openContactSelector(): team is required', undefined);
			return;
		}
		const selectorOptions: IContactSelectorOptions = {
			team,
			contactRole: this.parentRole || this.contactRole,
			subType: 'location',
			excludeContacts: this.counterparties?.map(c => ({ id: c.contactID, team })),
		};
		this.contactSelectorService.selectSingleContactInModal(selectorOptions)
			.then(contact => {
				console.log('OrderCounterpartiesCardComponent.openContactSelector() contact:', contact);
				if (!this.order?.dto) {
					return;
				}
				if (!contact?.brief) {
					return;
				}
				if (!this.order?.dto) {
					return;
				}
				const counterparty: IOrderCounterparty = {
					contactID: contact.id,
					title: contact.brief.title || contact.id,
					role: this.contactRole,
					address: contact.brief.address,
					countryID: contact.brief.address?.countryID || '--',
				};
				this.order = {
					...this.order,
					dto: {
						...this.order.dto,
						counterparties: [
							...(this.order.dto.counterparties || []),
							counterparty,
						],
					},
				};
				const request: IAddOrderShippingPointRequest = {
					teamID: team.id,
					orderID: this.order.id,
					type: 'pick',
					locationContactID: contact.id,
				};
				this.ordersService.addShippingPoint(request).subscribe({
					next: () => {
						console.log('added shipping point added to order');
					},
					error: e => {
						this.errorLogger.logError(e, 'Failed to add shipping point to order');
					},
				});
				this.setCounterparties();
				this.emitOrder();
			})
			.catch(this.errorLogger.logErrorHandler('failed to open contact selector'));
	}

	private emitOrder(): void {
		this.orderChange.emit(this.order);
	}

	remove(counterparty: ICounterparty): void {
		if (!this.team?.id) {
			throw new Error('team is required');
		}
		if (!this.order?.id) {
			throw new Error('team is required');
		}
		const request: IDeleteCounterpartyRequest = {
			teamID: this.team.id,
			orderID: this.order.id,
			role: counterparty.role,
			contactID: counterparty.contactID,
		};
		this.deleting.push(counterparty);
		this.ordersService.deleteCounterparty(request)
			.subscribe({
				next: () => {
					console.log('deleted counterparty');
				},
				error: this.errorLogger.logErrorHandler('failed to delete counterparty'),
			});
	}

}
