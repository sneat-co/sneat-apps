import { Component, Input } from '@angular/core';
import { ITeamContext } from '@sneat/team/models';
import { IExpressOrderContext } from '../../dto/order';

@Component({
	selector: 'sneat-express-orders-list',
	templateUrl: './orders-list.component.html',
	styleUrls: ['./orders-list.component.scss'],
})
export class OrdersListComponent {

	@Input() team?: ITeamContext;
	@Input() orders?: IExpressOrderContext[];

}
