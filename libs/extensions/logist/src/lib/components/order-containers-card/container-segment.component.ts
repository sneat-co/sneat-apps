import { NgIf } from '@angular/common';
import {
	ChangeDetectorRef,
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
	IonCard,
	IonCol,
	IonGrid,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonRow,
} from '@ionic/angular/standalone';
import { excludeUndefined } from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	IContainerPoint,
	IContainerSegment,
	IDeleteSegmentsRequest,
	IFreightLoad,
	ILogistOrderContext,
	IOrderCounterparty,
	IUpdateContainerPointRequest,
} from '../../dto';
import { LogistOrderService } from '../../services';
import {
	FreightLoadForm,
	FreightLoadFormComponent,
} from '../freight-load-form/freight-load-form.component';

@Component({
	selector: 'sneat-container-segment',
	templateUrl: './container-segment.component.html',
	imports: [
		FreightLoadFormComponent,
		IonItem,
		IonLabel,
		IonInput,
		IonCol,
		ReactiveFormsModule,
		IonRow,
		IonIcon,
		IonButtons,
		IonButton,
		IonCard,
		IonGrid,
		NgIf,
	],
})
export class ContainerSegmentComponent implements OnChanges {
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	private readonly orderService = inject(LogistOrderService);
	private readonly changedDetectorRef = inject(ChangeDetectorRef);

	@Input() order?: ILogistOrderContext;
	@Input() segment?: IContainerSegment;

	freightLoadForm = new FreightLoadForm();

	from?: IOrderCounterparty;
	to?: IOrderCounterparty;
	by?: IOrderCounterparty;

	fromPoint?: IContainerPoint;

	departDate = new FormControl<string>('');
	arriveDate = new FormControl<string>('');

	saving = false;

	datesForm = new FormGroup({
		departDate: this.departDate,
		arriveDate: this.arriveDate,
	});

	form = new FormGroup({
		dates: this.datesForm,
		freightLoad: this.freightLoadForm.group,
	});

	deleting = false;

	private setForm(): void {
		this.from = this.order?.dbo?.counterparties?.find(
			(c) =>
				c.contactID === this.segment?.from?.contactID &&
				c.role == this.segment?.from?.role,
		);
		this.fromPoint = this.order?.dbo?.containerPoints?.find(
			(p) =>
				p.containerID == this.segment?.containerID &&
				p.shippingPointID === this.segment?.from?.shippingPointID,
		);
		if (this.fromPoint) {
			if (!this.departDate.dirty) {
				this.departDate.setValue(
					this.fromPoint?.departure?.scheduledDate || '',
				);
			}
			if (!this.arriveDate.dirty) {
				this.arriveDate.setValue(this.fromPoint?.arrival?.scheduledDate || '');
			}
		}
		this.to = this.order?.dbo?.counterparties?.find(
			(c) =>
				c.contactID === this.segment?.to?.contactID &&
				c.role == this.segment?.to?.role,
		);
		this.by = this.order?.dbo?.counterparties?.find(
			(c) => c.contactID === this.segment?.byContactID && c.role == 'trucker',
		);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['order'] || changes['segment']) {
			this.setForm();
		}
	}

	onDepartDateChanged($event: Event): void {
		console.log('onDepartDateChanged', $event);
		if (
			this.departDate.value &&
			(!this.arriveDate.value || this.arriveDate.value < this.departDate.value)
		) {
			this.arriveDate.setValue(this.departDate.value);
		}
	}

	onArriveDateChanged($event: Event): void {
		console.log('onArriveDateChanged', $event);
		if (
			this.departDate.value &&
			this.arriveDate.value &&
			this.arriveDate.value < this.departDate.value
		) {
			this.departDate.setValue(null);
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
		const request: IDeleteSegmentsRequest = {
			spaceID: this.order.space.id,
			orderID: this.order.id,
			containerIDs: [containerID],
		};
		this.orderService.deleteSegments(request).subscribe({
			error: (err) => {
				this.deleting = false;
				this.errorLogger.logError(err, 'Failed to delete container segment');
			},
		});
	}

	get segmentDates(): string {
		const dates = this?.segment?.dates;
		if (!dates || (!dates?.start && !dates.end)) {
			return 'no dates yet';
		}
		const { start, end } = dates;
		const starts = start.split('-').reverse();
		const ends = end.split('-').reverse();
		if (start === end) {
			return starts.join('/');
		}
		if (!end) {
			return ends.join('/');
		}
		if (!start) {
			return ends.join('/');
		}
		if (starts[2] === ends[2]) {
			return `${starts[0]}/${starts[1]}-${ends.join('/')}`;
		}
		return `${starts.join('/')}-${ends.join('/')}`;
	}

	onFreightLoadChanged(freightLoad?: IFreightLoad): void {
		if (this.fromPoint) {
			this.fromPoint = excludeUndefined({
				...this.fromPoint,
				toLoad: freightLoad,
			});
		}
	}

	cancelChanges(event: Event): void {
		event.preventDefault();
		this.form.reset();
		this.setForm();
	}

	saveChanges(event: Event): void {
		console.log('saveChanges', event);
		if (!this.order || !this.fromPoint) {
			return;
		}
		const request: IUpdateContainerPointRequest = excludeUndefined({
			spaceID: this.order.space.id,
			orderID: this.order.id,
			containerID: this.fromPoint.containerID,
			shippingPointID: this.fromPoint.shippingPointID,
			departsDate: this.departDate.value || '',
			arrivesDate: this.arriveDate.value || '',
			toLoad: this.fromPoint?.toLoad,
		});
		this.form.disable();
		this.orderService.updateContainerPoint(request).subscribe({
			next: () => {
				console.log('updateContainerPoint success');
				this.form.markAsPristine();
			},
			error: (err) => {
				this.errorLogger.logError(
					err,
					'Failed to update container segment date',
				);
			},
			complete: () => {
				console.log('updateContainerPoint complete');
				this.form.enable();
				this.saving = false;
				this.changedDetectorRef.markForCheck();
			},
		});
	}
}
