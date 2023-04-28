import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ContactRole } from '@sneat/dto';
import { ITeamContext } from '@sneat/team/models';
import { add } from 'ionicons/icons';
import { CounterpartyRole, ILogistOrderContext, IOrderCounterparty } from '../../dto';

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
			this.counterparties = this.order?.dto?.counterparties?.filter(c => c.role === 'dispatch_agent' || c.role === 'receive_agent'
				|| c.role === 'carrier' // TODO: remove obsolete 'carrier' role
			);
		}
	}

	addAgent(event: Event): void {
		event.preventDefault();
		alert('Not implemented yet');
	}

	protected readonly add = add;
}
