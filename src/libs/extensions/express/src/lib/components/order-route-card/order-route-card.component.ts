import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IExpressOrderContext, ITransitPoint } from '../../dto';

@Component({
	selector: 'sneat-order-route-card',
	templateUrl: './order-route-card.component.html',
})
export class OrderRouteCardComponent {

	@Input() order: IExpressOrderContext = { id: '' };
	@Output() orderChange = new EventEmitter<IExpressOrderContext>();

	protected addTransitPoint(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		alert('Not implemented yet');
	}

	onTransitPointChanged(point: ITransitPoint): void {
		console.log('OrderRouteCardComponent.onTransitPointChanged()', point);
		let order = this.order;
		if (!order?.dto) {
			return;
		}
		let route = order?.dto?.route || {};
		switch (point.id) {
			case 'origin':
				route = { ...route, origin: point };
				break;
			case 'destination':
				route = { ...route, destination: point };
				break;
		}
		order = { ...order, dto: { ...order.dto, route } };
		this.orderChange.emit(order);
	}
}
