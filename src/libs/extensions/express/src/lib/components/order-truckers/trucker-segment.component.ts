import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IExpressOrderContext, IOrderCounterparty, IContainerSegment, IOrderSegment } from '../..';

@Component({
	selector: 'sneat-trucker-segment',
	templateUrl: './trucker-segment.component.html',
})
export class TruckerSegmentComponent implements OnChanges {
	@Input() order?: IExpressOrderContext;
	@Input() orderSegment?: IOrderSegment;
	@Input() trucker?: IOrderCounterparty;

	from?: IOrderCounterparty;
	to?: IOrderCounterparty;

	assignSegmentsToTransporter(): void {
		alert('not implemented yet');
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['order'] || changes['segment']) {
			this.from = this.order?.dto?.counterparties?.find(c =>
				c.contactID === this.orderSegment?.from?.contactID
				&& c.role == this.orderSegment?.from?.role
			);
			this.to = this.order?.dto?.counterparties?.find(c =>
				c.contactID === this.orderSegment?.to?.contactID
				&& c.role == this.orderSegment?.to?.role
			);
		}
	}

}
