import { Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	IExpressOrderContext,
	IOrderCounterparty,
	IContainerSegment,
	ExpressOrderService,
	IDeleteSegmentsRequest, IContainerShippingPoint,
} from '../..';

@Component({
	selector: 'sneat-container-segment',
	templateUrl: './container-segment.component.html',
})
export class ContainerSegmentComponent implements OnChanges {
	@Input() order?: IExpressOrderContext;
	@Input() segment?: IContainerSegment;

	from?: IOrderCounterparty;
	to?: IOrderCounterparty;
	by?: IOrderCounterparty;

	fromPoint?: IContainerShippingPoint;

	deleting = false;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly orderService: ExpressOrderService,
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
}
