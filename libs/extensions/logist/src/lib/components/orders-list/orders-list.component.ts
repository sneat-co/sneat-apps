import { Component, Input } from '@angular/core';
import { ISpaceContext } from '@sneat/team-models';
import { ILogistOrderContext } from '../../dto/order-dto';

@Component({
	selector: 'sneat-logist-orders-list',
	templateUrl: './orders-list.component.html',
})
export class OrdersListComponent {
	@Input({ required: true }) team?: ISpaceContext;
	@Input() orders?: ILogistOrderContext[];
}
