import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IExpressOrderContext, IOrderCounterparty, IOrderSegment } from '../..';
import { ITeamContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-order-trucker',
	templateUrl: './order-trucker.component.html',
})
export class OrderTruckerComponent implements OnChanges {
	@Input() team?: ITeamContext;
	@Input() order?: IExpressOrderContext;
	@Input() trucker?: IOrderCounterparty;

	public segments?: ReadonlyArray<IOrderSegment>;

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['order'] || changes['trucker']) {
			const contactID = this.trucker?.contactID;
			this.segments = this.order?.dto?.segments?.filter(s => s.contactIDs.by?.contactID === contactID);
		}
	}

	addSegment(): void {
		alert('not implemented yet');
	}
}
