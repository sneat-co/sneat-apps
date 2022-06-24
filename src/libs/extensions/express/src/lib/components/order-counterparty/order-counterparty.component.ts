import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ContactRoleExpress } from '@sneat/dto';
import { ITeamContext } from '@sneat/team/models';
import { IExpressOrderContext, IOrderCounterparty } from '../../dto/order';

@Component({
	selector: 'sneat-express-order-counterparty',
	templateUrl: './order-counterparty.component.html',
})
export class OrderCounterpartyComponent implements OnChanges {
	@Input() public readonly = false;
	@Input() team?: ITeamContext;
	@Input() order?: IExpressOrderContext;
	@Input() counterpartyRole: ContactRoleExpress | '' = '';

	protected counterparty?: IOrderCounterparty;

	protected refNumber = '';

	protected isRefNumberChanged = false;

	readonly label = () => this.counterpartyRole[0].toUpperCase() + this.counterpartyRole.slice(1);

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
	}

	protected cancelRefNumberChanges(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		this.refNumber = this.counterparty?.refNumber || '';
		this.isRefNumberChanged = false;
	}
}
