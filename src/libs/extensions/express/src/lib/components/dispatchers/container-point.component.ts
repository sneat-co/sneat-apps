import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IExpressOrderContext, IOrderContainer, IOrderCounterparty, IOrderSegment, IOrderShippingPoint } from '../..';

@Component({
	selector: 'sneat-container-point',
	templateUrl: './container-point.component.html',
})
export class ContainerPointComponent implements OnChanges {
	@Input() order?: IExpressOrderContext;
	@Input() shippingPoint?: IOrderShippingPoint;
	@Input() container?: IOrderContainer;

	arriveSegment?: IOrderSegment;
	departSegment?: IOrderSegment;

	truckerTo?: IOrderCounterparty;
	truckerFrom?: IOrderCounterparty;

	numberOfPallets?: number;
	grossKg?: number;
	arrivesOn = '';
	leavesOn = '';

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['order'] || changes['container'] || changes['shippingPoint']) {
			const containerID = this.container?.id || '';
			this.arriveSegment = this.order?.dto?.segments?.find(
				s => s.containerIDs.includes(containerID) && s.to?.shippingPointID === this.shippingPoint?.id,
			);
			this.departSegment = this.order?.dto?.segments?.find(
				s => s.containerIDs.includes(containerID) && s.from?.shippingPointID === this.shippingPoint?.id,
			);
			this.truckerTo = this.order?.dto?.counterparties?.find(c => c.contactID === this.arriveSegment?.by?.contactID);
			this.truckerFrom = this.order?.dto?.counterparties?.find(c => c.contactID === this.departSegment?.by?.contactID);
		}
		console.log('ContainerPointComponent.ngOnChanges',
			'order', this.order,
			'container', this.container,
			'shippingPoint', this.shippingPoint,
			'arriveSegment', this.arriveSegment,
			'truckerTo', this.truckerTo,
		);
	}
}
