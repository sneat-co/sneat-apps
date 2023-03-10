import { Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { LogistOrderContactRole, ContactType } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team/models';
import { CounterpartyRole } from '../../dto';
import {
	ILogistOrderContext,
	IOrderCounterparty,
	ISetOrderCounterpartiesRequest,
} from '../../dto/order-dto';
import { LogistOrderService } from '../../services';

@Component({
	selector: 'sneat-logist-order-counterparty',
	templateUrl: './order-counterparty.component.html',
})
export class OrderCounterpartyComponent implements OnChanges {
	@Input() labelPosition?: 'fixed' | 'stacked' | 'floating';
	@Input() readonly = false;
	@Input() useColumns = true;
	@Input() team?: ITeamContext;
	@Input() refNumLabel = 'Ref #'

	@Input() label?: string = undefined;

	@Input() canChangeContact = true;
	@Input() counterpartyRole?: CounterpartyRole;
	@Input() contactType?: ContactType;
	@Input() contactRole?: LogistOrderContactRole;
	@Input() parentRole?: LogistOrderContactRole;

	@Input() selectOnly = false;
	@Input() order?: ILogistOrderContext;
	@Output() readonly orderChange = new EventEmitter<ILogistOrderContext>();

	counterparty?: IOrderCounterparty;
	@Output() readonly counterpartyChange = new EventEmitter<IOrderCounterparty>();

	refNumber = '';

	isRefNumberChanged = false;

	savingRefNumber = false;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly orderService: LogistOrderService,
	) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['order'] || changes['counterpartyRole'] && this.order && this.counterpartyRole) {
			this.counterparty = this.order?.dto?.counterparties?.find(c => c.role === this.counterpartyRole);
			if (!this.isRefNumberChanged) {
				this.refNumber = this.counterparty?.refNumber || '';
			}
		}
	}

	protected onOrderChanged(order: ILogistOrderContext): void {
		console.log('OrderCounterpartyComponent.onOrderChanged():', order);
		this.setAndEmitOrder(order);
	}

	private setAndEmitOrder(order: ILogistOrderContext): void {
		this.order = order;
		this.orderChange.emit(order);
	}

	protected onRefNumberChanged(event: Event): void {
		console.log('onRefNumberChanged(), event:', event);
		this.isRefNumberChanged = (this.counterparty?.refNumber || '') !== this.refNumber;
		if (this.counterparty) {
			this.counterparty = {
				...this.counterparty,
				refNumber: this.refNumber,
			};
			if (this.order?.dto) {
				const i = this.order.dto?.counterparties?.findIndex(c => c.role === this.counterpartyRole);
				this.order = {
					...this.order,
					dto: {
						...this.order.dto,
						counterparties: i !== undefined && i >= 0 && this.order.dto?.counterparties
							? [...this.order.dto.counterparties.slice(0, i), this.counterparty, ...this.order.dto.counterparties.slice(i + 1)]
							: [...this.order.dto.counterparties || [], this.counterparty],
					},
				};
			}
		}
	}

	protected saveRefNumber(event: Event): void {
		console.log('saveRefNumber(), event:', event);
		event.stopPropagation();
		event.preventDefault();
		if (!this.isRefNumberChanged) {
			return;
		}
		if (!this.team) {
			console.error('saveRefNumber(): !this.team');
			return;
		}
		if (!this.counterpartyRole) {
			this.errorLogger.logError('saveRefNumber(): !this.counterpartyRole');
			return;
		}
		if (!this.order?.id) {
			this.errorLogger.logError('saveRefNumber(): !this.order.id');
			return;
		}
		if (!this.counterparty?.contactID) {
			this.errorLogger.logError('saveRefNumber(): !this.counterparty.contactID');
			return;
		}
		const request: ISetOrderCounterpartiesRequest = {
			teamID: this.team?.id,
			orderID: this.order?.id,
			counterparties: [
				{
					role: this.counterpartyRole,
					contactID: this.counterparty?.contactID,
					refNumber: this.refNumber || ' ',
				},
			],
		};
		this.savingRefNumber = true;
		this.orderService.setOrderCounterparties(request).subscribe({
			next: counterparty => {
				this.counterparty = counterparty;
				this.savingRefNumber = false;
				this.isRefNumberChanged = false;
			},
			error: err => {
				this.savingRefNumber = false;
				this.errorLogger.logError(err, 'Failed to save reference number');
			},
		});
	}

	protected cancelRefNumberChanges(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		this.refNumber = this.counterparty?.refNumber || '';
		this.isRefNumberChanged = false;
	}

	protected copyRefNumberToClipboard(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		const text = this.refNumber;
		if (text) {
			navigator.clipboard.writeText(text)
				.then(() => alert('Order number copied to clipboard: ' + text))
				.catch(err => alert('Error copying order number to clipboard: ' + err));
		}
	}

}
