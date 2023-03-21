import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { IContainerPoint, ILogistOrderContext, IOrderContainer, IOrderCounterparty, IShippingPoint } from '../../dto';
import { LogistOrderService } from '../../services';
import { OrderPrintPageBaseComponent } from '../order-print-page-base.component';

interface IPoint {
	containerPoint: IContainerPoint;
	shippingPoint?: IShippingPoint;
	location?: IOrderCounterparty;
	counterparty?: IOrderCounterparty;
}

@Component({
	selector: 'sneat-container-print-doc',
	templateUrl: './container-print-doc.component.html',
})
export class ContainerPrintDocComponent extends OrderPrintPageBaseComponent {
	protected containerID?: string | null;

	protected container?: IOrderContainer;
	protected points?: IPoint[];

	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		orderService: LogistOrderService,
	) {
		super('OrderShippingDocComponent', route, teamParams, orderService);
		route.queryParamMap.subscribe(params => {
			this.containerID = params.get('id');
		});
	}

	override onOrderChanged(order: ILogistOrderContext): void {
		if (this.containerID) {
			this.container = order.dto?.containers?.find(c => c.id === this.containerID);
		} else if (order.dto?.containers?.length) {
			this.container = order.dto?.containers?.[0];
			if (!this.containerID) {
				this.containerID = this.container?.id;
			}
		}
		if (this.containerID) {
			this.points = this.order?.dto?.containerPoints?.filter(p => p.containerID === this.containerID)
				.map(containerPoint => {
					const shippingPoint = this.order?.dto?.shippingPoints?.find(p => p.id === containerPoint.shippingPointID);
					const counterparty = shippingPoint ? this.order?.dto?.counterparties?.find(p => p.contactID === shippingPoint.counterparty.contactID) : undefined;
					const location = shippingPoint ? this.order?.dto?.counterparties?.find(p => p.contactID === shippingPoint.location.contactID) : undefined;
					const point: IPoint = {
						containerPoint,
						shippingPoint,
						counterparty,
						location,
					};
					return point;
				});
		}
	}
}
