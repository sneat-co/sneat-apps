import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ISpaceContext } from '@sneat/team-models';
import { ILogistOrderContext, IOrderCounterparty } from '../../dto';

@Component({
	selector: 'sneat-order-truckers',
	templateUrl: './order-truckers.component.html',
})
export class OrderTruckersComponent implements OnChanges {
	@Input({ required: true }) team?: ISpaceContext;
	@Input() order?: ILogistOrderContext;

	public truckers?: readonly IOrderCounterparty[];
	hasUnassignedSegments = false;

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['order']) {
			this.truckers = this.order?.dbo?.counterparties?.filter(
				(c) => c.role === 'trucker',
			);
			this.hasUnassignedSegments = !!this?.order?.dbo?.segments?.some(
				(s) => !s.byContactID,
			);
		}
	}
}
