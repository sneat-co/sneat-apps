import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IExpressOrderContext, IOrderCounterparty, IOrderSegment } from '../..';

@Component({
	selector: 'sneat-trucker-segment',
	templateUrl: './trucker-segment.component.html',
})
export class TruckerSegmentComponent implements OnChanges {
	@Input() order?: IExpressOrderContext;
	@Input() segment?: IOrderSegment;
	@Input() trucker?: IOrderCounterparty;

	from?: IOrderCounterparty;
	to?: IOrderCounterparty;

	assignSegmentsToTransporter(): void {
		alert('not implemented yet');
	}

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
		}
	}

}
