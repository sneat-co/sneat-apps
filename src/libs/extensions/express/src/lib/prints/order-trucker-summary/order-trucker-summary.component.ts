import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContactService } from '@sneat/extensions/contactus';
import {
	ExpressOrderService, IContainerSegment,
	IExpressOrderContext,
	IFreightLoad, IOrderContainer,
	IOrderCounterparty,
	IOrderShippingPoint,
} from '../..';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { OrderPrintPageBaseComponent } from '../order-print-page-base.component';

interface IContainerInfo {
	from?: IOrderShippingPoint;
	counterparty?: IOrderCounterparty;
	toPick?: IFreightLoad;
	segment?: IContainerSegment;
	container?: IOrderContainer;
}

@Component({
	selector: 'sneat-print-order-trucker-summary',
	templateUrl: './order-trucker-summary.component.html',
})
export class OrderTruckerSummaryComponent extends OrderPrintPageBaseComponent {

	truckerID?: string;
	truckerCounterparty?: IOrderCounterparty;
	selfCounterparty?: IOrderCounterparty;
	ship?: IOrderCounterparty;
	shipperCounterparty?: IOrderCounterparty;
	points?: ReadonlyArray<IContainerInfo>;

	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		orderService: ExpressOrderService,
		private readonly contactService: ContactService,
	) {
		super('OrderTruckerSummaryComponent', route, teamParams, orderService);
		route.queryParams?.subscribe({
			next: params => {
				this.truckerID = params['truckerID'];
				console.log('truckerID', this.truckerID);
				if (this.order?.dto) {
					this.setTrucker();
				}
			},
		});
	}

	private setTrucker(): void {
		this.truckerCounterparty = this?.order?.dto?.counterparties?.find(c => c.role === 'trucker' && c.contactID === this.truckerID);
	}

	protected override onOrderChanged(order: IExpressOrderContext) {
		super.onOrderChanged(order);
		const counterparties = this.order?.dto?.counterparties;
		if (this.truckerID) {
			this.setTrucker();
		}
		this.selfCounterparty = counterparties?.find(c => c.contactID === this.team?.id);
		this.ship = counterparties?.find(c => c.role === 'ship');
		this.shipperCounterparty = counterparties?.find(c => c.role === 'shipper');
		this.points = order.dto?.segments?.filter(s => s.by?.contactID === this.truckerID)
			.map(segment => {
				const container = order?.dto?.containers?.find(c => c.id === segment.containerID);
				const toPick = order?.dto?.containerPoints?.find(p => p.containerID === segment.containerID && p.shippingPointID === segment.from.shippingPointID)?.toPick;
				const from = order?.dto?.shippingPoints?.find(p => p.id === segment.from.shippingPointID);
				const counterparty = order?.dto?.counterparties?.find(c => c.contactID === segment.from.contactID);
				const containerInfo: IContainerInfo = {container, from, toPick, segment, counterparty};
				return containerInfo;
			});
	}
}
