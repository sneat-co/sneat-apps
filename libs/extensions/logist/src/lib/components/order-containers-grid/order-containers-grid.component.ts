import { NgIf } from '@angular/common';
import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	inject,
} from '@angular/core';
import { IonCard, IonCardContent } from '@ionic/angular/standalone';
import { DataGridComponent } from '@sneat/datagrid';
import { IGridColumn } from '@sneat/grid';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { RowComponent, RowContextMenuSignature } from 'tabulator-tables';
import {
	IContainerRequest,
	ILogistOrderContext,
	IOrderContainer,
} from '../../dto';
import { LogistOrderService } from '../../services';

interface IOrderContainerWithIndex extends IOrderContainer {
	i: number;
}

@Component({
	selector: 'sneat-order-containers-grid',
	templateUrl: './order-containers-grid.component.html',
	imports: [IonCard, IonCardContent, DataGridComponent, NgIf],
})
export class OrderContainersGridComponent implements OnChanges {
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	private readonly orderService = inject(LogistOrderService);

	protected containers?: IOrderContainer[];

	@Input() order?: ILogistOrderContext;
	@Output() readonly containerSelected = new EventEmitter<IOrderContainer>();

	protected readonly rowContextMenu: RowContextMenuSignature = [
		{
			label: 'Select',
			action: (e: Event, row: RowComponent) => {
				row.select();
				const data = row.getData() as IOrderContainerWithIndex;
				this.containerSelected.emit(
					this.order?.dbo?.containers?.find((c) => c.id === data.id),
				);
			},
		},
		{
			separator: true,
		},
		{
			label: '🗑️ Delete',
			action: (e: Event, row: RowComponent) => {
				row.select();
				const data = row.getData() as IOrderContainerWithIndex;
				console.log('Delete row', data);
				const orderID = this.order?.id,
					spaceID = this.order?.space?.id;
				if (!orderID || !spaceID) {
					return;
				}
				const request: IContainerRequest = {
					orderID,
					spaceID: spaceID,
					containerID: data.id,
				};
				this.orderService.deleteContainer(request).subscribe({
					error: this.errorLogger.logErrorHandler('Failed to delete container'),
				});
			},
		},
	];

	readonly allCols: IGridColumn[] = [
		{
			field: 'i',
			dbType: 'number',
			title: '#',
			hozAlign: 'right',
			headerHozAlign: 'right',
			width: 20,
			widthShrink: 2,
		},
		{
			field: 'type',
			dbType: 'string',
			title: 'Size',
			width: 60,
			widthShrink: 2,
		},
		{
			field: 'number',
			dbType: 'string',
			title: 'Serial number',
		},
		/*
		{
			field: 'loadPointsCount',
			dbType: 'number',
			title: 'Load points',
			hozAlign: 'right',
			headerHozAlign: 'right',
		},
		{
			field: 'unloadPointsCount',
			dbType: 'number',
			title: 'Unload points',
			hozAlign: 'right',
			headerHozAlign: 'right',
		},
		{
			field: 'segmentsCount',
			dbType: 'number',
			title: 'Segments',
			hozAlign: 'right',
			headerHozAlign: 'right',
		},
		{
			field: 'numberOfPallets',
			dbType: 'number',
			title: 'Pallets',
			hozAlign: 'right',
			headerHozAlign: 'right',
		},
		{
			field: 'grossWeightKg',
			dbType: 'number',
			title: 'Gross weights (kg)',
			hozAlign: 'right',
			headerHozAlign: 'right',
		},
		{
			field: 'volumeM3',
			dbType: 'number',
			title: 'Volume (m3)',
			hozAlign: 'right',
			headerHozAlign: 'right',
		},
		 */
	];

	protected selectedContainer?: IOrderContainer;

	ngOnChanges(/*changes: SimpleChanges*/): void {
		const containers = this.order?.dbo?.containers?.map((c, i) => ({
			...c,
			i: i + 1,
		}));
		this.containers = containers ? [...containers] : undefined;
	}

	protected readonly rowSelected = (row: unknown) => {
		this.selectedContainer = this.containers?.find(
			(c) => c.id === (row as { getData: () => { id: string } }).getData().id,
		);
		this.containerSelected.emit(this.selectedContainer);
	};

	protected readonly rowClick = (event: Event, row: unknown) => {
		console.log('OrdersGridComponent.rowClick():', event, row);
		// 	if (!this.team) {
		// 		alert('No team context provided!');
		// 		return;
		// 	}
		// 	const data = (row as { getData: () => { id: string } }).getData();
		// 	const team = this.team;
		// 	if (!team) {
		// 		alert('No team context provided!');
		// 		return;
		// 	}
		// 	this.zone.run(() => this.navController
		// 		.navigateForward(['space', team.type, team.id, 'order', data.id])
		// 		.catch(this.errorLogger.logErrorHandler('Failed to navigate to order details page')))
		// 		.then(() => void 0)
		// 	;
	};
}
