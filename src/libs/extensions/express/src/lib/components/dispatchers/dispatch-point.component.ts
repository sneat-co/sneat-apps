import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IExpressOrderContext, IOrderCounterparty, IOrderSegment } from '../..';

@Component({
	selector: 'sneat-dispatch-point',
	templateUrl: './dispatch-point.component.html',
})
export class DispatchPointComponent implements OnChanges {
	@Input() dispatchPoint?: IOrderCounterparty;
	@Input() order?: IExpressOrderContext;

	segments?: ReadonlyArray<IOrderSegment>;

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['order'] || changes['dispatchPoint']) {
			const contactID = this.dispatchPoint?.contactID;
			this.segments = this.order?.dto?.segments?.filter(s =>
				s.from?.contactID === contactID
				|| s.to?.contactID === contactID
			);
		}
	}
}
