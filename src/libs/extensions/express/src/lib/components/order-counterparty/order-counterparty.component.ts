import { Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IonLabel } from '@ionic/angular';
import { ContactRoleExpress } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team/models';
import { IExpressOrderContext, IOrderCounterparty, ISetOrderCounterpartyRequest } from '../../dto/order';
import { FreightOrdersService } from '../../services';

@Component({
	selector: 'sneat-express-order-counterparty',
	templateUrl: './order-counterparty.component.html',
})
export class OrderCounterpartyComponent implements OnChanges {
	@Input() labelPosition?: 'fixed' | 'stacked' | 'floating';
	@Input() public readonly = false;
	@Input() team?: ITeamContext;
	@Input() order?: IExpressOrderContext;
	@Input() counterpartyRole: ContactRoleExpress | '' = '';

	protected counterparty?: IOrderCounterparty;

	protected refNumber = '';

	protected isRefNumberChanged = false;

	protected savingRefNumber = false;

	readonly label = () => this.counterpartyRole[0].toUpperCase() + this.counterpartyRole.slice(1);

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly orderService: FreightOrdersService,
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

	protected onRefNumberChanged(event: Event): void {
		console.log('onRefNumberChanged(), event:', event);
		this.isRefNumberChanged = (this.counterparty?.refNumber || '') !== this.refNumber;
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
		const request: ISetOrderCounterpartyRequest = {
			teamID: this.team?.id,
			orderID: this.order?.id,
			role: this.counterpartyRole,
			contactID: this.counterparty?.contactID,
			refNumber: this.refNumber,
		};
		this.savingRefNumber = true;
		this.orderService.setOrderCounterparty(request).subscribe({
			next: counterparty => {
				this.counterparty = counterparty;
				this.savingRefNumber = false;
				this.isRefNumberChanged = false;
			},
			error: err => {
				this.savingRefNumber = false;
				this.errorLogger.logError(err,'Failed to save reference number')
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
