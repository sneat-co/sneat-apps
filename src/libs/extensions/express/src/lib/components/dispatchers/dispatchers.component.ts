import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ContactSelectorService, IContactSelectorOptions } from '@sneat/extensions/contactus';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IAddOrderShippingPointRequest, IExpressOrderContext, IOrderCounterparty } from '../../dto';
import { ExpressOrderService } from '../../services';

interface IDispatcher extends IOrderCounterparty {
	locations?: IOrderCounterparty[];
}

@Component({
	selector: 'sneat-dispatchers',
	templateUrl: './dispatchers.component.html',
})
export class DispatchersComponent implements OnChanges {
	@Input() order?: IExpressOrderContext;
	@Output() readonly orderChange = new EventEmitter<IExpressOrderContext>();

	protected dispatchers?: IDispatcher[];

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly contactSelectorService: ContactSelectorService,
		private readonly ordersService: ExpressOrderService,
	) {
		console.log('DispatchersComponent.constructor()');
	}

	private readonly counterpartyToDispatcher = (c: IOrderCounterparty): IDispatcher => {
		return { ...c, locations: this.order?.dto?.counterparties?.filter(l => l.parentContactID === c.contactID) };
	};

	ngOnChanges(changes: SimpleChanges): void {
		if (this.order?.dto) {
			this.dispatchers = this.order.dto.counterparties
					?.filter(c => c.role === 'dispatcher')
					?.map(this.counterpartyToDispatcher)
				|| [];

		} else {
			this.dispatchers = undefined;
		}
		console.log('DispatchersComponent.ngOnChanges', this.order, this.dispatchers);
	}

	addDispatchPoint(event: Event, dispatcher: IDispatcher): void {
		console.log('addDispatchPoint(), event:', event, dispatcher);
		event.stopPropagation();
		event.preventDefault();
		const team = this.order?.team;
		if (!team) {
			this.errorLogger.logError('ContactInputComponent.openContactSelector(): team is required', undefined);
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
			excludeContacts: this.dispatchers?.map(c => ({ id: c.contactID, team })),
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
}
