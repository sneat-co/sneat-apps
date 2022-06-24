import { Component, Input } from '@angular/core';
import { ContactRoleExpress } from '@sneat/dto';
import { ITeamContext } from '@sneat/team/models';
import { IExpressOrderContext } from '../../dto/order';

@Component({
	selector: 'sneat-express-order-counterparty',
	templateUrl: './order-counterparty.component.html',
})
export class OrderCounterpartyComponent {
	@Input() public readonly = false;
	@Input() team?: ITeamContext;
	@Input() order?: IExpressOrderContext;
	@Input() counterpartyRole: ContactRoleExpress | '' = '';

	readonly label = () => this.counterpartyRole[0].toUpperCase() + this.counterpartyRole.slice(1);
}
