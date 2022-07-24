import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { ContactRole, ContactRoleExpress, ContactType } from '@sneat/dto';
import { FreightOrdersService } from '../../services';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IContactContext, ITeamContext } from '@sneat/team/models';
import {
	IExpressOrderContext,
	IOrderCounterparty,
	IOrderShippingPointCounterparty,
	ISetOrderCounterpartyRequest,
} from '../../dto';

@Component({
	selector: 'sneat-express-order-counterparty-input',
	templateUrl: './order-counterparty-input.component.html',
})
export class OrderCounterpartyInputComponent {
	@Input() canReset = false;
	@Input() labelPosition?: 'fixed' | 'stacked' | 'floating';
	@Input() readonly = false;
	@Input() team?: ITeamContext;
	@Input() contactRole?: ContactRoleExpress;
	@Input() contactType?: ContactType;
	@Input() parentRole?: ContactRoleExpress;
	@Input() canChangeContact = true;

	@Input() order?: IExpressOrderContext;
	@Output() orderChange = new EventEmitter<IExpressOrderContext>();

	@Output() counterpartyChange = new EventEmitter<IOrderShippingPointCounterparty>();

	@Input() label = 'Counterparty';

	get contact(): IContactContext | undefined {
		if (!this.team) {
			throw new Error('Team is not set');
		}
		const c = this.order?.dto?.counterparties?.find(c => c.role === this.contactRole);
		if (c) {
			const contact: IContactContext = {
				team: this.team,
				id: c.contactID,
				brief: {
					type: 'company',
					id: c.contactID,
					title: c.title,
					name: { full: c.title },
				},
			};
			return contact;
		}
		return undefined;
	};

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly orderService: FreightOrdersService,
	) {

	}

	protected onContactChanged(contact: IContactContext): void {
		console.log('onContactChanged(),', this.contactRole, contact);
		if (!this.team) {
			console.error('onContactChanged(): !this.team');
			return;
		}
		if (!this.contactRole) {
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

		if (!this.order?.id) {
			const newCounterparty: IOrderCounterparty = {
				contactID: contact.id,
				role: this.contactRole,
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
							...orderDto.counterparties.slice(i+1),
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
				case 'notify':
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
				case 'carrier':
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
		const request: ISetOrderCounterpartyRequest = {
			teamID: this.team.id,
			orderID: this.order.id,
			contactID: contact.id.substring(contact.id.indexOf(':') + 1),
			role: this.contactRole,
		};
		this.orderService.setOrderCounterparty(request).subscribe({
			next: counterparty => {
				if (!this.order?.brief) {
					return;
				}
				// switch (this.counterpartyRole) {
				// 	case 'buyer':
				// 		this.order.brief.buyer = counterparty;
				// 		break;
				// 	case 'shipper':
				// 		this.order.brief.shipper = counterparty;
				// 		break;
				// 	case 'agent':
				// 		this.order.brief.agent = counterparty;
				// 		break;
				// 	case 'consignee':
				// 		this.order.brief.consignee = counterparty;
				// 		break;
				// 	case 'carrier':
				// 		this.order.brief.carrier = counterparty;
				// 		break;
				// }
			},
			error: this.errorLogger.logErrorHandler(`Failed to set order's counterparty`),
		});
	}

	private emitOrder(order: IExpressOrderContext): void {
		this.order = order;
		this.orderChange.emit(order);
	}
}
