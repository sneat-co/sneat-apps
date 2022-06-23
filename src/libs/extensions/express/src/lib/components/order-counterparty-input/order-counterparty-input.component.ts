import { Component, Input } from '@angular/core';
import { ITeamContext } from '@sneat/team/models';
import { IExpressOrderContext } from '../../dto/order';

@Component({
	selector: 'sneat-express-order-counterparty-input',
	templateUrl: './order-counterparty-input.component.html',
})
export class OrderCounterpartyInputComponent {
	@Input() readonly = false;
	@Input() team?: ITeamContext;
	@Input() order?: IExpressOrderContext;
	@Input() counterpartyRole = '';

	readonly label = () => this.counterpartyRole[0].toUpperCase() + this.counterpartyRole.slice(1);
}
