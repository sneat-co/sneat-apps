import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IExpressOrderContext, IOrderCounterparty, IContainerSegment } from '../..';

@Component({
	selector: 'sneat-container-segment',
	templateUrl: './container-segment.component.html',
})
export class ContainerSegmentComponent implements OnChanges {
	@Input() order?: IExpressOrderContext;
	@Input() segment?: IContainerSegment;

	from?: IOrderCounterparty;
	to?: IOrderCounterparty;
	by?: IOrderCounterparty;

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['order'] || changes['segment']) {
			this.from = this.order?.dto?.counterparties?.find(c =>
				c.contactID === this.segment?.from?.contactID
				&& c.role == this.segment?.from?.role
			);
			this.to = this.order?.dto?.counterparties?.find(c =>
				c.contactID === this.segment?.to?.contactID
				&& c.role == this.segment?.to?.role
			);
			this.by = this.order?.dto?.counterparties?.find(c =>
				c.contactID === this.segment?.by?.contactID
				&& c.role == this.segment?.by?.role
			);
		}
	}
}
