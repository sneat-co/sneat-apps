import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IGridColumn } from '@sneat/grid';
import { ITeamContext } from '@sneat/team/models';
import { IExpressOrderContext, IOrderCounterparty } from '../../dto/order-dto';

@Component({
	selector: 'sneat-express-orders-list',
	templateUrl: './orders-list.component.html',
	styleUrls: ['./orders-list.component.scss'],
})
export class OrdersListComponent {

	@Input() team?: ITeamContext;
	@Input() orders?: IExpressOrderContext[];
}
