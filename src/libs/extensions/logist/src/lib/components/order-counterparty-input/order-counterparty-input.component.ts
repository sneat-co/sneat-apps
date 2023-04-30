import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { LogistOrderContactRole, ContactType } from '@sneat/dto';
import { LogistOrderService } from '../../services';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IContactContext, ITeamContext } from '@sneat/team/models';
import {
	CounterpartyRole, IDeleteCounterpartyRequest,
	ILogistOrderContext,
	IOrderCounterparty,
	IOrderCounterpartyRef,
	ISetOrderCounterpartiesRequest,
} from '../../dto';

@Component({
	selector: 'sneat-logist-order-counterparty-input',
	templateUrl: './order-counterparty-input.component.html',
})
export class OrderCounterpartyInputComponent implements OnChanges {
	@Input() label?: string = undefined;
	@Input() canReset = false;
	@Input() labelPosition?: 'fixed' | 'stacked' | 'floating';
	@Input() readonly = false;
	@Input() team?: ITeamContext;

	@Input() counterpartyRole?: CounterpartyRole;

	@Input() contactRole?: LogistOrderContactRole;
	@Input() contactType?: ContactType;


	@Input() parentType: ContactType = 'company';
	@Input() parentRole?: LogistOrderContactRole;

	@Input() canChangeContact = true;
	@Input() contactID?: string;

	@Input() selectOnly = false;

	@Input() order?: ILogistOrderContext;
	@Output() orderChange = new EventEmitter<ILogistOrderContext>();

	@Output() counterpartyChange = new EventEmitter<IOrderCounterpartyRef>();


	protected contact?: IContactContext;
	protected parentContact?: IContactContext;

	protected deleting = false;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly orderService: LogistOrderService,
	) {

	}

	ngOnChanges(changes: SimpleChanges): void {
		// console.log('OrderCounterpartyInputComponent.ngOnChanges()', changes);
		if (
			changes['order'] ||
			changes['contactID'] ||
			changes['counterpartyRole'] ||
			changes['contactRole'] ||
			changes['parentRole']
		) {
			this.setContacts();
		}
	}

	private setContacts(): void {
		if (!this.order) {
			return;
		}
		const team = this.team;
		if (!team) {
			throw new Error('Team is not set');
		}
		const contactFromCounterparty = (counterparty: IOrderCounterparty): IContactContext => ({
			team,
			id: counterparty.contactID,
			brief: {
				type: 'company',
				id: counterparty.contactID,
				countryID: counterparty.countryID,
				title: counterparty.title,
				name: { full: counterparty.title },
			},
		});
		this.contact = undefined;
		const counterparties = this.contactID
			? this.order?.dto?.counterparties?.filter(c => c.contactID === this.contactID && c.role === this.counterpartyRole)
			: this.order?.dto?.counterparties?.filter(c => c.role === this.counterpartyRole);
		if (counterparties && counterparties.length === 1) {
			const counterparty = counterparties[0];
			this.contact = contactFromCounterparty(counterparty);
			if (counterparty.parent) {
				const parentCounterparty = this.order?.dto?.counterparties?.find(c => c.contactID === counterparty.parent?.contactID);
				if (parentCounterparty) {
					this.parentContact = contactFromCounterparty(parentCounterparty);
				}
			}
		}
	}

	protected onContactChanged(contact?: IContactContext): void {
		console.log('onContactChanged(),', this.contactRole, contact);
		if (this.selectOnly) {
			return;
		}
		if (!this.team) {
			console.error('onContactChanged(): !this.team');
			return;
		}
		if (!this.counterpartyRole) {
			console.error('onContactChanged(): !this.counterpartyRole');
			return;
		}
		let order = this.order;
		if (!order) {
			return;
		}
		let orderDto = order?.dto;

		if (!orderDto) {
			console.error('onContactChanged(): !this.order.dto');
			return;
		}

		if (!contact) {
			if (!this.contact) {
				return;
			}
			console.error('Not implemented counterparty removal');
			const request: IDeleteCounterpartyRequest = {
				orderID: order.id,
				teamID: this.team.id,
				contactID: this.contact.id,
				role: this.counterpartyRole,
			};
			this.deleting = true;
			this.orderService.deleteCounterparty(request).subscribe({
				next: () => {
					this.contact = undefined;
					this.deleting = false;
				},
				error: err => {
					this.deleting = false;
					this.errorLogger.logError(err, `Failed to remove counterparty with role=${this.counterpartyRole} from the order`);
				},
			});
			return;
		}

		if (!this.order?.id) {
			const newCounterparty: IOrderCounterparty = {
				contactID: contact.id,
				role: this.counterpartyRole,
				title: contact?.brief?.title || contact.id,
				countryID: contact?.brief?.countryID || '--',
			};
			const i = orderDto.counterparties?.findIndex(c => c.role === this.contactRole) ?? -1;
			if (i >= 0) {
				if (orderDto.counterparties) {
					orderDto = {
						...orderDto, counterparties: [
							...orderDto.counterparties.slice(0, i),
							newCounterparty,
							...orderDto.counterparties.slice(i + 1),
						],
					};
				}
			} else {
				if (orderDto) {
					orderDto = {
						...orderDto,
						counterparties: orderDto.counterparties
							? [...orderDto.counterparties, newCounterparty]
							: [newCounterparty],
					};
				}
			}
			if (!orderDto.route) {
				orderDto = { ...orderDto, route: {} };
			}
			switch (this.contactRole) {
				case 'consignee':
				case 'notify_party':
					if (orderDto.route) {
						orderDto = {
							...orderDto, route: {
								...orderDto.route,
								destination: {
									countryID: newCounterparty.countryID,
								},
							},
						};
					}
					break;
				case 'freight_agent':
				case 'shipper':
					if (orderDto.route) {
						orderDto = {
							...orderDto, route: {
								...orderDto.route,
								origin: {
									countryID: newCounterparty.countryID,
								},
							},
						};
					}
					break;
			}
			if (order) {
				order = { ...order, dto: orderDto };
			}
			this.emitOrder(order);
			this.counterpartyChange.emit(newCounterparty);
			return;
		}
		let request: ISetOrderCounterpartiesRequest = {
			teamID: this.team.id,
			orderID: this.order.id,
			counterparties: [
				{
					contactID: contact.id.substring(contact.id.indexOf(':') + 1),
					role: this.counterpartyRole,
				},
			],
		};
		if (contact.parentContact && this.parentRole) {
			request = {
				...request,
				counterparties: [...request.counterparties, {
					contactID: contact.parentContact.id,
					role: this.parentRole,
				}],
			};
		}
		this.orderService.setOrderCounterparties(request).subscribe({
			next: counterparty => {
				console.log('onContactChanged(): setOrderCounterparties() =>', counterparty);
				if (!this.order?.brief) {
					return;
				}
			},
			error: this.errorLogger.logErrorHandler(`Failed to set order's counterparty`),
		});
	}

	private emitOrder(order: ILogistOrderContext): void {
		this.order = order;
		this.orderChange.emit(order);
	}
}
