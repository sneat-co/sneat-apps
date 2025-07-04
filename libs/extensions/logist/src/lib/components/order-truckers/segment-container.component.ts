import { NgIf } from '@angular/common';
import {
	Component,
	Input,
	OnChanges,
	SimpleChanges,
	inject,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
	IonButton,
	IonButtons,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
} from '@ionic/angular/standalone';
import { excludeUndefined } from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	IContainerPoint,
	IContainerSegment,
	IDeleteSegmentsRequest,
	ILogistOrderContext,
	IOrderContainer,
} from '../../dto';
import { LogistOrderService } from '../../services';
import { FreightLoadForm } from '../freight-load-form/freight-load-form.component';

@Component({
	selector: 'sneat-segment-container',
	templateUrl: './segment-container.component.html',
	imports: [
		IonItem,
		IonLabel,
		IonInput,
		IonButtons,
		IonButton,
		ReactiveFormsModule,
		IonIcon,
		NgIf,
	],
})
export class SegmentContainerComponent implements OnChanges {
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	private readonly orderService = inject(LogistOrderService);

	@Input() order?: ILogistOrderContext;
	@Input() segment?: IContainerSegment;

	readonly freightLoadForm = new FreightLoadForm();

	container?: IOrderContainer;
	from?: IContainerPoint;

	deleting = false;

	departureDate = new FormControl<string>('');
	arrivalDate = new FormControl<string>('');

	form = new FormGroup({
		departureDate: this.departureDate,
		arrivalDate: this.arrivalDate,
	});

	constructor() {
		this.form.disable();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['containerID'] || changes['order']) {
			const containerID = this.segment?.containerID;
			this.container = this.order?.dbo?.containers?.find(
				(c) => c.id === containerID,
			);

			const fromShippingPointID = this.segment?.from?.shippingPointID;
			this.from = this.order?.dbo?.containerPoints?.find(
				(p) =>
					p.containerID === containerID &&
					p.shippingPointID === fromShippingPointID,
			);
		}
		if (changes['segment']) {
			this.setDates();
		}
	}

	private setDates(): void {
		if (this.segment) {
			this.departureDate.setValue(this.segment.dates?.start || '');
			this.arrivalDate.setValue(this.segment.dates?.end || '');
			if (!this.form.enabled) {
				this.form.enable();
			}
		} else {
			this.form.disable();
		}
	}

	delete(): void {
		if (!this.order?.id) {
			return;
		}
		const containerID = this.segment?.containerID;
		if (!containerID) {
			return;
		}
		this.deleting = true;
		const request: IDeleteSegmentsRequest =
			excludeUndefined<IDeleteSegmentsRequest>({
				spaceID: this.order.space.id,
				orderID: this.order.id,
				containerIDs: [containerID],
				fromShippingPointID: this.segment?.from.shippingPointID,
				toShippingPointID: this.segment?.to.shippingPointID,
				byContactID: this.segment?.byContactID,
			});
		this.orderService.deleteSegments(request).subscribe({
			error: (err) => {
				this.deleting = false;
				this.errorLogger.logError(err, 'Failed to delete container segment');
			},
		});
	}

	notImplemented(): void {
		alert('Not implemented yet');
	}

	resetChanges(): void {
		this.form.reset();
		this.setDates();
	}

	saveChanges(): void {
		this.freightLoadForm.group.reset();
	}
}
