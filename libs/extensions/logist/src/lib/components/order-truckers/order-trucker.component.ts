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
	IonItemDivider,
	IonLabel,
	IonSpinner,
} from '@ionic/angular/standalone';
import { CountryFlagPipe } from '@sneat/components';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/space-models';
import {
	getOrderSegments,
	IDeleteCounterpartyRequest,
	ILogistOrderContext,
	IOrderCounterparty,
	IOrderSegment,
} from '../../dto';
import {
	IOrderPrintedDocContext,
	OrderPrintService,
} from '../../prints/order-print.service';
import { LogistOrderService } from '../../services';
import { NewSegmentService } from '../new-segment/new-segment.service';
import { TruckerSegmentComponent } from './trucker-segment.component';

@Component({
	selector: 'sneat-order-trucker',
	templateUrl: './order-trucker.component.html',
	imports: [
		IonCard,
		IonItem,
		IonLabel,
		IonInput,
		IonButtons,
		IonButton,
		IonIcon,
		IonSpinner,
		IonItemDivider,
		TruckerSegmentComponent,
		CountryFlagPipe,
	],
})
export class OrderTruckerComponent implements OnChanges {
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	private readonly ordersService = inject(LogistOrderService);
	private readonly orderPrintService = inject(OrderPrintService);
	private readonly newSegmentService = inject(NewSegmentService);

	@Input({ required: true }) space?: ISpaceContext;
	@Input() order?: ILogistOrderContext;
	@Input() trucker?: IOrderCounterparty;

	// public segments?: ReadonlyArray<IContainerSegment>;

	public orderSegments?: readonly IOrderSegment[];

	deleting = false;

	ngOnChanges(changes: SimpleChanges): void {
		console.log('OrderTruckerComponent.ngOnChanges', changes);
		if (changes['order'] || changes['trucker']) {
			const contactID = this.trucker?.contactID;
			this.orderSegments = getOrderSegments(
				this.order?.dbo?.segments?.filter((s) => s.byContactID === contactID),
			);
		}
	}

	protected addSegment(): void {
		const order = this.order;
		if (!order) {
			return;
		}
		this.newSegmentService
			.goNewSegmentPage({ order })
			.catch(
				this.errorLogger.logErrorHandler(
					'Failed to navigate to new segment page',
				),
			);
	}

	deleteTrucker(): void {
		if (!this.order || !this.trucker) {
			return;
		}
		const request: IDeleteCounterpartyRequest = {
			spaceID: this.order?.space?.id,
			orderID: this.order.id,
			contactID: this.trucker?.contactID,
			role: 'trucker',
		};
		this.deleting = true;
		this.ordersService.deleteCounterparty(request).subscribe({
			next: () => {
				console.log('deleted trucker');
			},
			error: (err) => {
				this.errorLogger.logError(err, 'Failed to delete trucker');
				this.deleting = false;
			},
		});
	}

	replaceTrucker(): void {
		alert('not implemented yet');
	}

	print(event: Event): void {
		if (!this.order) {
			alert('Can not print without order context');
			return;
		}
		const ctx: IOrderPrintedDocContext = {
			...this.order,
			params: {
				truckerID: this?.trucker?.contactID,
			},
		};
		this.orderPrintService.openOrderPrintedDocument(
			event,
			'trucker-summary',
			ctx,
		);
	}
}
