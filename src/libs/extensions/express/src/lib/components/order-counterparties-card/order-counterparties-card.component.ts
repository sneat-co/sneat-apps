import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ContactSelectorService, IContactSelectorOptions } from '@sneat/extensions/contactus';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team/models';
import { IExpressOrderContext, IOrderCounterparty } from '../..';

@Component({
	selector: 'sneat-express-order-counterparties-card',
	templateUrl: './order-counterparties-card.component.html',
})
export class OrderCounterpartiesCardComponent implements OnChanges {
	@Input() team?: ITeamContext;
	@Input() order?: IExpressOrderContext;
	@Output() readonly orderChange = new EventEmitter<IExpressOrderContext>();
	@Input() readonly = false;
	@Input() plural: string = 'dispatchers';
	@Input() singular: string = 'dispatcher';
	@Input() role: 'dispatcher' = 'dispatcher';

	public counterparties?: IOrderCounterparty[];

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly contactSelectorService: ContactSelectorService,
	) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['order']) {
			this.setCounterparties();
		}
	}

	private setCounterparties(): void {
		this.counterparties = this.order?.dto?.counterparties?.filter(counterparty => counterparty.role === this.role);
	}

	addCounterparty(event: Event): void {
		console.log('addCounterparty(), event:', event);
		event.stopPropagation();
		event.preventDefault();
		if (!this.team) {
			this.errorLogger.logError('ContactInputComponent.openContactSelector(): team is required', undefined);
			return;
		}
		const selectorOptions: IContactSelectorOptions = {
			team: this.team,
			role: this.role,
		};
		this.contactSelectorService.selectSingleContactsInModal(selectorOptions)
			.then(contact => {
				console.log('ContactInputComponent.openContactSelector() contact:', contact);
				if (!this.order?.dto) {
					return;
				}
				if (!contact?.dto) {
					return;
				}
				const counterparty: IOrderCounterparty = {
					contactID: contact.id,
					title: contact.dto.title || contact.id,
					role: this.role,
					address: contact.dto.address,
					countryID: contact.dto.address?.countryID || '--',
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
				this.setCounterparties();
				this.emitOrder();
			})
			.catch(this.errorLogger.logErrorHandler('failed to open contact selector'));
	}

	private emitOrder(): void {
		this.orderChange.emit(this.order);
	}

}
