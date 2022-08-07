import { Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	ExpressOrderService,
	IExpressOrderContext,
	IOrderContainer,
	IOrderCounterparty,
	IContainerSegment,
	IOrderShippingPoint, IOrderShippingPointRequest,
} from '../..';

@Component({
	selector: 'sneat-dispatch-point',
	templateUrl: './dispatch-point.component.html',
})
export class DispatchPointComponent implements OnChanges {
	@Input() dispatchPoint?: IOrderCounterparty;
	@Input() order?: IExpressOrderContext;
	@Input() disabled = false;

	shippingPoint?: IOrderShippingPoint;
	segments?: ReadonlyArray<IContainerSegment>;
	containers?: ReadonlyArray<IOrderContainer>;
	dispatcher?: IOrderCounterparty;

	@Input() deleting = false;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly orderService: ExpressOrderService,
	) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['order'] || changes['dispatchPoint']) {
			const contactID = this.dispatchPoint?.contactID;
			this.dispatcher = this.order?.dto?.counterparties?.find(c => c.contactID === contactID && c.role === 'dispatcher');
			this.shippingPoint = this.order?.dto?.shippingPoints?.find(sp => sp.location?.contactID === contactID);
			this.segments = this.order?.dto?.segments?.filter(s =>
				s.from?.contactID === contactID
				|| s.to?.contactID === contactID,
			);
			this.containers = this.order?.dto?.containers?.filter(c => this.segments?.some(s => s.containerID === c.id));

		}
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
