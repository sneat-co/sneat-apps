import { Component, Input } from '@angular/core';
import { IOrderContext } from '../../dto/order';

@Component({
	selector: 'sneat-freights-list',
	templateUrl: './orders-list.component.html',
	styleUrls: ['./orders-list.component.scss'],
})
export class OrdersListComponent {

	@Input() orders?: IOrderContext[];

}
