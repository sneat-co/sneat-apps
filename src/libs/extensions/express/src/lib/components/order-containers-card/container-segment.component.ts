import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IExpressOrderContext, IOrderCounterparty, IOrderSegment } from '../..';

@Component({
	selector: 'sneat-container-segment',
	templateUrl: './container-segment.component.html',
})
export class ContainerSegmentComponent implements OnChanges {
	@Input() order?: IExpressOrderContext;
	@Input() segment?: IOrderSegment;

	from?: IOrderCounterparty;
	to?: IOrderCounterparty;
	by?: IOrderCounterparty;

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['order'] || changes['segment']) {
			this.from = this.order?.dto?.counterparties?.find(c =>
				c.contactID === this.segment?.contactIDs.from?.contactID
				&& c.role == this.segment?.contactIDs?.from?.counterpartyRole
			);
			this.to = this.order?.dto?.counterparties?.find(c =>
				c.contactID === this.segment?.contactIDs.to?.contactID
				&& c.role == this.segment?.contactIDs?.to?.counterpartyRole
			);
			this.by = this.order?.dto?.counterparties?.find(c =>
				c.contactID === this.segment?.contactIDs.by?.contactID
				&& c.role == this.segment?.contactIDs?.by?.counterpartyRole
			);
		}
	}
}
