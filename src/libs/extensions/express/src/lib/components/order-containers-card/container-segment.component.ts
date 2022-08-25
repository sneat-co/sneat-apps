import { ChangeDetectorRef, Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { excludeUndefined } from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	IExpressOrderContext,
	IOrderCounterparty,
	IContainerSegment,
	ExpressOrderService,
	IDeleteSegmentsRequest,
	IContainerPoint,
	IUpdateContainerPointRequest, IFreightLoad,
} from '../..';
import { FreightLoadForm } from '../freight-load-form/freight-load-form.component';

@Component({
	selector: 'sneat-container-segment',
	templateUrl: './container-segment.component.html',
})
export class ContainerSegmentComponent implements OnChanges {
	@Input() order?: IExpressOrderContext;
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

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly orderService: ExpressOrderService,
		private readonly changedDetectorRef: ChangeDetectorRef,
	) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['order'] || changes['segment']) {
			this.from = this.order?.dto?.counterparties?.find(c =>
				c.contactID === this.segment?.from?.contactID
				&& c.role == this.segment?.from?.role,
			);
			this.fromPoint = this.order?.dto?.containerPoints?.find(
				p => p.containerID == this.segment?.containerID && p.shippingPointID === this.segment?.from?.shippingPointID,
			);
			if (this.fromPoint) {
				if (!this.departDate.dirty) {
					this.departDate.setValue(this.fromPoint?.departsDate || '');
				}
				if (!this.arriveDate.dirty) {
					this.arriveDate.setValue(this.fromPoint?.arrivesDate || '');
				}
			}
			this.to = this.order?.dto?.counterparties?.find(c =>
				c.contactID === this.segment?.to?.contactID
				&& c.role == this.segment?.to?.role,
			);
			this.by = this.order?.dto?.counterparties?.find(c =>
				c.contactID === this.segment?.by?.contactID
				&& c.role == this.segment?.by?.role,
			);
		}
	}

	onDepartDateChanged($event: Event): void {
		console.log('onDepartDateChanged', $event);
		if (this.departDate.value && (!this.arriveDate.value || this.arriveDate.value < this.departDate.value)) {
			this.arriveDate.setValue(this.departDate.value);
		}
	}

	onArriveDateChanged($event: Event): void {
		console.log('onArriveDateChanged', $event);
		if (this.departDate.value && this.arriveDate.value && this.arriveDate.value < this.departDate.value) {
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
			teamID: this.order.team.id,
			orderID: this.order.id,
			containerIDs: [containerID],
		};
		this.orderService.deleteSegments(request).subscribe({
			error: err => {
				this.deleting = false;
				this.errorLogger.logError(err, 'Failed to delete container segment');
			},
		});
	}

	get segmentDates(): string {
		const dates = this?.segment?.dates;
		if (!dates || !dates?.start && !dates.end) {
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
				toPick: freightLoad,
			});
		}
	}

	saveChanges(event: Event): void {
		if (!this.order || !this.fromPoint) {
			return;
		}
		const request: IUpdateContainerPointRequest = excludeUndefined({
			teamID: this.order.team.id,
			orderID: this.order.id,
			containerID: this.fromPoint.containerID,
			shippingPointID: this.fromPoint.shippingPointID,
			departsDate: this.departDate.value || '',
			arrivesDate: this.arriveDate.value || '',
			toPick: this.fromPoint?.toPick,
		});
		this.form.disable();
		this.orderService.updateContainerPoint(request).subscribe({
			next: () => {
				console.log('updateContainerPoint success');
				this.form.markAsPristine();
			},
			error: err => {
				this.errorLogger.logError(err, 'Failed to update container segment date');
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
