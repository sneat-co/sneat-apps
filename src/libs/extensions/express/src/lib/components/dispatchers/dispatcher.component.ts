import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ContactSelectorService, IContactSelectorOptions } from '@sneat/extensions/contactus';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	ExpressOrderService,
	IAddOrderShippingPointRequest,
	IDeleteCounterpartyRequest,
	IExpressOrderContext,
	IOrderCounterparty,
} from '../..';

@Component({
	selector: 'sneat-order-dispatcher',
	templateUrl: './dispatcher.component.html',
})
export class DispatcherComponent implements OnChanges {
	@Input() order?: IExpressOrderContext;
	@Input() counterparty?: IOrderCounterparty;
	@Input() orderDispatchers?: ReadonlyArray<IOrderCounterparty>;

	@Output() orderChange = new EventEmitter<IExpressOrderContext>();

	locations?: IOrderCounterparty[];

	deleting = false;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly contactSelectorService: ContactSelectorService,
		private readonly ordersService: ExpressOrderService,
	) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['order'] || changes['counterparty']) {
			const contactID = this.counterparty?.contactID
			this.locations = this.order?.dto?.counterparties?.filter(l => l.parentContactID === contactID)
		}
	}

	addDispatchPoint(event: Event): void {
		console.log('addDispatchPoint(), event:', event);
		event.stopPropagation();
		event.preventDefault();
		const team = this.order?.team;
		if (!team) {
			this.errorLogger.logError('ContactInputComponent.openContactSelector(): team is required', undefined);
			return;
		}
		const dispatcher = this.counterparty;
		if (!dispatcher) {
			alert('dispatcher is required');
			return;
		}
		const selectorOptions: IContactSelectorOptions = {
			team,
			contactRole: 'dispatch-point',
			contactType: 'location',
			parentRole: 'dispatcher',
			parentContact: {
				id: dispatcher.contactID, team, brief: {
					id: dispatcher.contactID,
					type: 'company',
					title: dispatcher.title,
					countryID: dispatcher.countryID,
				},
			},
			excludeContacts: this.orderDispatchers?.map(c => ({ id: c.contactID, team })),
		};
		this.contactSelectorService.selectSingleContactInModal(selectorOptions)
			.then(contact => {
				console.log('OrderCounterpartiesCardComponent.openContactSelector() contact:', contact);
				if (!this.order?.dto) {
					alert('Order is not loaded');
					return;
				}
				if (!contact?.brief) {
					alert('Contact is not loaded');
					return;
				}
				const team = this.order.team;
				// const counterparty: IOrderCounterparty = {
				// 	contactID: contact.id,
				// 	title: contact.brief.title || contact.id,
				// 	role: 'dispatcher',
				// 	address: contact.brief.address,
				// 	countryID: contact.brief.address?.countryID || '--',
				// };
				const request: IAddOrderShippingPointRequest = {
					teamID: team.id,
					orderID: this.order.id,
					type: 'pick',
					locationContactID: contact.id,
				};
				this.ordersService.addShippingPoint(team, request).subscribe({
					next: order => {
						console.log('added shipping point added to order');
						this.order = { ...order, team: this.order?.team || team };
						this.orderChange.emit(this.order);
					},
					error: e => {
						this.errorLogger.logError(e, 'Failed to add shipping point to order');
					},
				});
			})
			.catch(this.errorLogger.logErrorHandler('failed to open contact selector'));
	}

	deleteDispatcher(): void {
		if (!this.order || !this.counterparty) {
			return;
		}
		const request: IDeleteCounterpartyRequest = {
			teamID: this.order?.team?.id,
			orderID: this.order.id,
			contactID: this.counterparty?.contactID,
			role: 'dispatcher',
		}
		this.deleting = true;
		this.ordersService.deleteCounterparty(request).subscribe({
			next: () => {
				console.log('deleted dispatcher');
			},
			error: err => {
				this.errorLogger.logError(err, 'Failed to delete dispatcher');
				this.deleting = false;
			}
		})
	}
}
