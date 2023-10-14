import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IGridColumn } from '@sneat/grid';
import { IContainerSegment, ILogistOrderContext, IOrderContainer, IOrderShippingPoint } from '../../dto';

interface IContainerRouteRow {
	i: number;
	segment: IContainerSegment;
	from: string;
	to: string;
}

@Component({
	selector: 'sneat-container-segments',
	templateUrl: './container-segments.component.html',
})
export class ContainerSegmentsComponent implements OnChanges {
	@Input() container?: IOrderContainer;
	@Input() order?: ILogistOrderContext;

	protected containerSegments?: readonly IContainerSegment[];
	protected routeRows?: IContainerRouteRow[];

	protected selectedSegment?: IContainerSegment;

	protected readonly allCols: IGridColumn[] = [
		{
			field: 'i',
			dbType: 'number',
			title: '#',
			hozAlign: 'right',
			headerHozAlign: 'right',
			width: 50,
			widthShrink: 2,
		},
		{
			field: 'from',
			dbType: 'string',
			title: 'From',
		},
		{
			field: 'to',
			dbType: 'string',
			title: 'To',
		},
		{
			field: 'by',
			dbType: 'string',
			title: 'By',
		},
		{
			field: 'departureDate',
			dbType: 'string',
			title: 'Departs',
		},
		{
			field: 'arrivalDate',
			dbType: 'string',
			title: 'Arrives',
		},
	];


	ngOnChanges(changes: SimpleChanges): void {
		if (changes['order'] || changes['container']) {
			const containerID = this.container?.id;
			this.containerSegments = containerID ? this.order?.dto?.segments?.filter(s => s.containerID === containerID) : undefined;
			if (this.containerSegments?.length === 1 && !this.selectedSegment) {
				this.selectedSegment = this.containerSegments[0];
			}
			this.routeRows = this.containerSegments?.map((segment, i) => {
				const fromPoint: IOrderShippingPoint | undefined = this.order?.dto?.shippingPoints?.find(sp => sp.id === segment.from.shippingPointID);
				const toPoint = this.order?.dto?.shippingPoints?.find(sp => sp.id === segment.to.shippingPointID);
				const by = this.order?.dto?.counterparties?.find(c => c.contactID === segment.byContactID);
				const from = fromPoint ? `${fromPoint.location?.title} @ ${fromPoint?.counterparty?.title}` : 'pointID:' + segment.from.shippingPointID;
				const to = toPoint ? `${toPoint.location?.title} @ ${toPoint?.counterparty?.title}` : 'pointID:' + segment.to.shippingPointID;
				return {
					i: i + 1,
					segment,
					from,
					to,
					by: by?.title,
				};
			});
			if (this.selectedSegment && !this.containerSegments?.some(s => s.from?.shippingPointID === this.selectedSegment?.from?.shippingPointID && s.to?.shippingPointID === this.selectedSegment?.to?.shippingPointID)) {
				this.selectedSegment = undefined;
			}
		}
	}

	protected segmentID(_: number, segment: IContainerSegment): string {
		return segment.containerID + '-' + segment.from.shippingPointID + '-' + segment.to.shippingPointID;
	}
	protected readonly rowSelected = (row: unknown) => {
		this.selectedSegment = (row as { getData: () => { segment: IContainerSegment } }).getData().segment;
	}
}
