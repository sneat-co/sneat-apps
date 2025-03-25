import { Component, Input } from '@angular/core';
import { ISpaceContext } from '@sneat/space-models';
import { ILogistOrderContext } from '../../dto/order-dto';

@Component({
	selector: 'sneat-logist-orders-list',
	templateUrl: './orders-list.component.html',
	standalone: false,
})
export class OrdersListComponent {
	@Input({ required: true }) space?: ISpaceContext;
	@Input() orders?: ILogistOrderContext[];
}
