import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IGridColumn } from '@sneat/grid';
import { IContainerPoint, ILogistOrderContext, IOrderCounterparty, IOrderShippingPoint } from '../../dto';

interface IDispatchPointContainerRow {
	readonly i: number;
	readonly containerID: string;
	readonly number?: string;
}

@Component({
	selector: 'sneat-dispatch-point-containers-grid',
	templateUrl: './dispatch-point-containers-grid.component.html',
})
export class DispatchPointContainersGridComponent implements OnChanges {
	@Input() order?: ILogistOrderContext;
	@Input() counterparty?: IOrderCounterparty;
	@Input() shippingPoint?: IOrderShippingPoint;

	protected containerPoints: IDispatchPointContainerRow[] = [];

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
			field: 'type',
			dbType: 'string',
			title: 'Size',
			width: 100,
			widthShrink: 2,
		},
		{
			field: 'number',
			dbType: 'string',
			title: 'Serial number',
		},
		{
			field: 'arrivalDate',
			dbType: 'string',
			title: 'Arrives',
		},
		{
			field: 'departureDate',
			dbType: 'string',
			title: 'Departs',
		},
		// {
		// 	field: 'unloadNumberOfPallets',
		// 	dbType: 'number',
		// 	title: 'Unload: Pallets',
		// 	hozAlign: 'right',
		// 	headerHozAlign: 'right',
		// },
		// {
		// 	field: 'unloadGrossWeightKg',
		// 	dbType: 'number',
		// 	title: 'Unload: Gross (kg)',
		// 	hozAlign: 'right',
		// 	headerHozAlign: 'right',
		// },
		// {
		// 	field: 'unloadVolumeM3',
		// 	dbType: 'number',
		// 	title: 'Unload: Volume (m3)',
		// 	hozAlign: 'right',
		// 	headerHozAlign: 'right',
		// },
		{
			field: 'loadNumberOfPallets',
			dbType: 'number',
			title: 'Load: Pallets',
			hozAlign: 'right',
			headerHozAlign: 'right',
		},
		{
			field: 'loadGrossWeightKg',
			dbType: 'number',
			title: 'Load: Gross (kg)',
			hozAlign: 'right',
			headerHozAlign: 'right',
		},
		{
			field: 'loadVolumeM3',
			dbType: 'number',
			title: 'Load: Volume (m3)',
			hozAlign: 'right',
			headerHozAlign: 'right',
		},
	];

	ngOnChanges(changes: SimpleChanges): void {
		const shippingPointID = this.shippingPoint?.id;

		const containerPoints = shippingPointID
			? this.order?.dto?.containerPoints?.filter(cp => cp.shippingPointID === shippingPointID)
			: [];
		const containerPointToRow = (cp: IContainerPoint, i: number): IDispatchPointContainerRow => {
			const container = this.order?.dto?.containers?.find(c => c.id === cp.containerID);
			const row: IDispatchPointContainerRow = { i: i + 1, containerID: cp.containerID, number: container?.number };
			return row;
		};
		this.containerPoints = containerPoints?.map(containerPointToRow) || [];
		console.log('shippingPointID', shippingPointID, 'containerPoints', containerPoints, 'order', this.order?.dto);
	}
}
