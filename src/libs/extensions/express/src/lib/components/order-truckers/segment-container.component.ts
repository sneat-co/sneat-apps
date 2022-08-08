import { Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { excludeUndefined } from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	ExpressOrderService,
	IContainerSegment,
	IDeleteSegmentsRequest,
	IExpressOrderContext,
	IOrderContainer,
} from '../..';

@Component({
	selector: 'sneat-segment-container',
	templateUrl: './segment-container.component.html',
})
export class SegmentContainerComponent implements OnChanges {
	@Input() order?: IExpressOrderContext;
	@Input() segment?: IContainerSegment;

	container?: IOrderContainer;

	deleting = false;

	departureDate = new FormControl<string>('');
	arrivalDate = new FormControl<string>('');

	form = new FormGroup({
		departureDate: this.departureDate,
		arrivalDate: this.arrivalDate,
	});

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly orderService: ExpressOrderService,
	) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['containerID'] || changes['order']) {
			this.container = this.order?.dto?.containers?.find(c => c.id === this.segment?.containerID);
		}
		if (changes['segment']) {
			this.setDates();
		}
	}

	private setDates(): void {
		this.departureDate.setValue(this?.segment?.dates?.start || '');
		this.arrivalDate.setValue(this?.segment?.dates?.end || '');
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
		const request: IDeleteSegmentsRequest = excludeUndefined({
			teamID: this.order.team.id,
			orderID: this.order.id,
			containerIDs: [containerID],
			from: this.segment?.from,
			to: this.segment?.to,
			by: this.segment?.by,
		});
		this.orderService.deleteSegments(request).subscribe({
			error: err => {
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
}
