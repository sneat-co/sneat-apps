import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IExpressOrderContext, IOrderCounterparty } from '../..';
import { ITeamContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-order-truckers',
	templateUrl: './order-truckers.component.html',
})
export class OrderTruckersComponent implements OnChanges {
	@Input() team?: ITeamContext;
	@Input() order?: IExpressOrderContext;

	public truckers?: ReadonlyArray<IOrderCounterparty>;
	hasUnassignedSegments = false;

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['order']) {
			this.truckers = this.order?.dto?.counterparties?.filter(c => c.role === 'trucker');
			this.hasUnassignedSegments = !!this?.order?.dto?.segments?.some(s => !s.byContactID);
		}
	}
}
