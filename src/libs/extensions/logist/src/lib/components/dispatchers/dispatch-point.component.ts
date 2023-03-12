import { Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	IContainerPoint,
	IContainerSegment,
	ILogistOrderContext, IOrderContainer,
	IOrderCounterparty,
	IOrderShippingPoint,
	IOrderShippingPointRequest,
} from '../../dto';
import { LogistOrderService } from '../../services';
import { OrderContainersSelectorService } from '../order-containers-selector/order-containers-selector.service';

@Component({
	selector: 'sneat-dispatch-point',
	templateUrl: './dispatch-point.component.html',
})
export class DispatchPointComponent implements OnChanges {
	@Input() dispatchPoint?: IOrderCounterparty;
	@Input() order?: ILogistOrderContext;
	@Input() disabled = false;

	shippingPoint?: IOrderShippingPoint;
	segments?: ReadonlyArray<IContainerSegment>;
	containerPoints?: ReadonlyArray<IContainerPoint>;
	containers?: ReadonlyArray<IOrderContainer>;
	dispatcher?: IOrderCounterparty;

	@Input() deleting = false;

	notes = new FormControl<string>('');
	address = new FormControl<string>('');

	form = new FormGroup({
		notes: this.notes,
		address: this.address,
	});

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly orderService: LogistOrderService,
		private readonly containersSelectorService: OrderContainersSelectorService,
	) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['order'] || changes['dispatchPoint']) {
			const orderDto = this.order?.dto;
			const contactID = this.dispatchPoint?.contactID;
			this.dispatcher = orderDto?.counterparties?.find(c => c.contactID === contactID && c.role === 'dispatcher');
			this.shippingPoint = orderDto?.shippingPoints?.find(sp => sp.location?.contactID === contactID);
			if (!this.address.dirty) {
				this.address.setValue(this.shippingPoint?.location?.address?.lines?.join('\n') || '');
			}
			const shippingPointID = this.shippingPoint?.id;
			this.containerPoints = orderDto?.containerPoints?.filter(cp => cp.shippingPointID === shippingPointID);
			this.segments = this.order?.dto?.segments?.filter(s =>
				s.from.shippingPointID === shippingPointID || s.to.shippingPointID === shippingPointID,
			);
			this.containers = this.order?.dto?.containers?.filter(c => this.segments?.some(s => s.containerID === c.id) || this.containerPoints?.some(cp => cp.containerID === c.id));
			console.log('DispatchPointComponent.ngOnChanges();', shippingPointID, this.segments, this.containers);
		}
	}

	assignContainers(event: Event): void {
		event.stopPropagation();
		this.containersSelectorService.selectOrderContainersInModal(this.order).then(containers => {
			console.log('assignContainers() => selected container: ', containers);
		});
	}

	deletePoint(): void {
		if (!this.order || !this.shippingPoint) {
			return;
		}
		if (this.shippingPoint) {
			const request: IOrderShippingPointRequest = {
				teamID: this.order.team.id,
				orderID: this.order.id,
				shippingPointID: this.shippingPoint.id,
			};
			this.deleting = true;
			this.orderService.deleteShippingPoint(request).subscribe({
				next: () => {
					console.log('deleted');
				},
				error: err => {
					this.errorLogger.logError(err, 'Failed to delete shipping point');
					this.deleting = false;
				},
			});
		}
	}
}
