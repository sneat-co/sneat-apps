import {
	Component,
	Input,
	OnChanges,
	SimpleChanges,
	inject,
} from '@angular/core';
import {
	IonButton,
	IonButtons,
	IonCard,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
} from '@ionic/angular/standalone';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	IDeleteSegmentsRequest,
	ILogistOrderContext,
	IOrderCounterparty,
	IOrderSegment,
} from '../../dto';
import {
	IOrderPrintedDocContext,
	OrderPrintService,
} from '../../prints/order-print.service';
import { LogistOrderService } from '../../services';
import { SegmentContainerComponent } from './segment-container.component';

@Component({
	selector: 'sneat-trucker-segment',
	templateUrl: './trucker-segment.component.html',
	imports: [
		SegmentContainerComponent,
		IonItem,
		IonCard,
		IonLabel,
		IonInput,
		IonButtons,
		IonButton,
		IonIcon,
	],
})
export class TruckerSegmentComponent implements OnChanges {
	private readonly orderService = inject(LogistOrderService);
	private readonly orderPrintService = inject(OrderPrintService);
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);

	@Input() order?: ILogistOrderContext;
	@Input() orderSegment?: IOrderSegment;
	@Input() trucker?: IOrderCounterparty;

	from?: IOrderCounterparty;
	to?: IOrderCounterparty;

	deleting = false;

	assignSegmentsToTransporter(): void {
		alert('not implemented yet');
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['order'] || changes['segment']) {
			this.from = this.order?.dbo?.counterparties?.find(
				(c) =>
					c.contactID === this.orderSegment?.from?.contactID &&
					c.role == this.orderSegment?.from?.role,
			);
			this.to = this.order?.dbo?.counterparties?.find(
				(c) =>
					c.contactID === this.orderSegment?.to?.contactID &&
					c.role == this.orderSegment?.to?.role,
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
		this.orderPrintService.openOrderPrintedDocument(
			event,
			'trucker-summary',
			ctx,
		);
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
			spaceID: this.order.space.id,
			fromShippingPointID: this.orderSegment.from.shippingPointID,
			toShippingPointID: this.orderSegment.to.shippingPointID,
			byContactID: this.orderSegment.byContactID,
		};

		this.deleting = true;
		this.orderService.deleteSegments(request).subscribe({
			next: () => {
				console.log('deleted trucker segments');
			},
			error: (err) => {
				this.deleting = false;
				this.errorLogger.logError(err, 'Failed to delete trucker segments');
			},
		});
	}
}
