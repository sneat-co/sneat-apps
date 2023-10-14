import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ITeamContext } from '@sneat/team/models';
import { ILogistOrderContext, IOrderCounterparty } from '../../dto';

@Component({
	selector: 'sneat-order-truckers',
	templateUrl: './order-truckers.component.html',
})
export class OrderTruckersComponent implements OnChanges {
	@Input({ required: true }) team?: ITeamContext;
	@Input() order?: ILogistOrderContext;

	public truckers?: ReadonlyArray<IOrderCounterparty>;
	hasUnassignedSegments = false;

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['order']) {
			this.truckers = this.order?.dto?.counterparties?.filter(
				(c) => c.role === 'trucker',
			);
			this.hasUnassignedSegments = !!this?.order?.dto?.segments?.some(
				(s) => !s.byContactID,
			);
		}
	}
}
