import { Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IDeleteSegmentsRequest, ILogistOrderContext, IOrderCounterparty, IOrderSegment } from '../../dto';
import { IOrderPrintedDocContext, OrderPrintService } from '../../prints/order-print.service';
import { LogistOrderService } from '../../services';

@Component({
	selector: 'sneat-trucker-segment',
	templateUrl: './trucker-segment.component.html',
})
export class TruckerSegmentComponent implements OnChanges {
	@Input() order?: ILogistOrderContext;
	@Input() orderSegment?: IOrderSegment;
	@Input() trucker?: IOrderCounterparty;

	from?: IOrderCounterparty;
	to?: IOrderCounterparty;

	deleting = false;

	constructor(
		private readonly orderService: LogistOrderService,
		private readonly orderPrintService: OrderPrintService,
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
	) {
	}

	assignSegmentsToTransporter(): void {
		alert('not implemented yet');
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['order'] || changes['segment']) {
			this.from = this.order?.dto?.counterparties?.find(c =>
				c.contactID === this.orderSegment?.from?.contactID
				&& c.role == this.orderSegment?.from?.role,
			);
			this.to = this.order?.dto?.counterparties?.find(c =>
				c.contactID === this.orderSegment?.to?.contactID
				&& c.role == this.orderSegment?.to?.role,
			);
		}
	}

	print(event: Event): void {
		if (!this.order) {
			return;
		}
		const ctx: IOrderPrintedDocContext = {
			...this.order,
		};
		this.orderPrintService.openOrderPrintedDocument(event, 'trucker-summary', ctx);
	}

	deleteTruckerSegments(): void {
		console.log('deleteTruckerSegments()');
		if (!this.order) {
			throw new Error('order is required');
		}
		if (!this.orderSegment) {
			throw new Error('orderSegment is required');
		}
		const request: IDeleteSegmentsRequest = {
			orderID: this.order.id,
			teamID: this.order.team.id,
			fromShippingPointID: this.orderSegment.from.shippingPointID,
			toShippingPointID: this.orderSegment.to.shippingPointID,
			byContactID: this.orderSegment.byContactID,
		};

		this.deleting = true;
		this.orderService.deleteSegments(request).subscribe({
			next: () => {
				console.log('deleted trucker segments');
			},
			error: err => {
				this.deleting = false;
				this.errorLogger.logError(err,'Failed to delete trucker segments')
			},
		});
	}
}
