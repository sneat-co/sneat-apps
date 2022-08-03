import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IExpressOrderContext, IOrderContainer, IOrderCounterparty, IOrderSegment, IOrderShippingPoint } from '../..';

@Component({
	selector: 'sneat-dispatch-point',
	templateUrl: './dispatch-point.component.html',
})
export class DispatchPointComponent implements OnChanges {
	@Input() dispatchPoint?: IOrderCounterparty;
	@Input() order?: IExpressOrderContext;

	shippingPoint?: IOrderShippingPoint;
	segments?: ReadonlyArray<IOrderSegment>;
	containers?: ReadonlyArray<IOrderContainer>;
	dispatcher?: IOrderCounterparty;

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['order'] || changes['dispatchPoint']) {
			const contactID = this.dispatchPoint?.contactID;
			this.dispatcher = this.order?.dto?.counterparties?.find(c => c.contactID === contactID && c.role === 'dispatcher');
			this.shippingPoint = this.order?.dto?.shippingPoints?.find(sp => sp.location?.contactID === contactID);
			this.segments = this.order?.dto?.segments?.filter(s =>
				s.from?.contactID === contactID
				|| s.to?.contactID === contactID
			);
			this.containers = this.order?.dto?.containers?.filter(c => this.segments?.some(s => s.containerIDs.includes(c.id)));
		}
	}
}
