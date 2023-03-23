import { Component, Input, OnChanges } from '@angular/core';
import { IGridColumn } from '@sneat/grid';
import {
	ContainerType,
	IContainerPoint,
	ILogistOrderContext,
	IOrderCounterparty,
	IOrderShippingPoint,
} from '../../dto';

interface IDispatchPointContainerRow {
	readonly i: number;
	readonly containerID: string;
	readonly type?: ContainerType;
	readonly arrivalScheduledDate?: string;
	readonly departureScheduledDate?: string;
	readonly number?: string;
	readonly tasks?: string;
	readonly loadNumberOfPallets?: number;
	readonly loadGrossWeightKg?: number;
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
			width: 150,
			widthShrink: 2,
		},
		{
			field: 'tasks',
			dbType: 'string',
			title: 'Tasks',
		},
		{
			field: 'arrivalScheduledDate',
			dbType: 'string',
			title: 'Arrives (scheduled)',
			width: 150,
		},
		{
			field: 'departureScheduleDate',
			dbType: 'string',
			title: 'Departs (scheduled)',
			width: 150,
		},
	];

	ngOnChanges(/*changes: SimpleChanges*/): void {
		const shippingPointID = this.shippingPoint?.id;

		const containerPoints = shippingPointID
			? this.order?.dto?.containerPoints?.filter(cp => cp.shippingPointID === shippingPointID)
			: [];
		const containerPointToRow = (cp: IContainerPoint, i: number): IDispatchPointContainerRow => {
			const container = this.order?.dto?.containers?.find(c => c.id === cp.containerID);
			const tasks = cp.tasks.map(task => {
				const load = task === 'load' ? cp.toLoad : task === 'unload' ? cp.toUnload : undefined;
				if (load?.numberOfPallets && load.grossWeightKg) {
					return `${task} ${load.numberOfPallets} pallets, ${load.grossWeightKg}kg`;
				} else if (load?.numberOfPallets) {
					return `${task} ${load.numberOfPallets} pallets`;
				} else if (load?.grossWeightKg) {
					return `${task} ${load.grossWeightKg}kg`;
				}
				return task;
			}).join(', ');
			return  {
				i: i + 1,
				type: container?.type,
				containerID: cp.containerID,
				number: container?.number,
				tasks ,
				arrivalScheduledDate: cp.arrival?.scheduledDate,
				departureScheduledDate: cp.departure?.scheduledDate,
				loadNumberOfPallets: cp.toLoad?.numberOfPallets,
				loadGrossWeightKg: cp.toLoad?.grossWeightKg,
			};
		};
		this.containerPoints = containerPoints?.map(containerPointToRow) || [];
		console.log('DispatchPointContainersGridComponent.ngOnChanges(): shippingPointID', shippingPointID, 'containerPoints', containerPoints, 'this.containerPoints:', this.containerPoints, 'order', this.order?.dto);
	}
}
