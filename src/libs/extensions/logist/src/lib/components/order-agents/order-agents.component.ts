import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ITeamContext } from '@sneat/team/models';
import { ILogistOrderContext, IOrderCounterparty } from '../../dto';

@Component({
	selector: 'sneat-order-agents',
	templateUrl: './order-agents.component.html',
})
export class OrderAgentsComponent implements OnChanges {
	@Input() public readonly = false;
	@Input() team?: ITeamContext;
	@Input() order?: ILogistOrderContext;

	protected counterparties?: IOrderCounterparty[];

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['order']) {
			this.counterparties = this.order?.dto?.counterparties?.filter(c => c.role === 'freight_agent');
		}
	}

	addAgent(event: Event): void {
		event.preventDefault();
		alert('Not implemented yet');
	}
}
