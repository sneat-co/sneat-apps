import { Component, EventEmitter, Inject, Input, NgZone, OnChanges, Output } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IGridColumn } from '@sneat/grid';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ILogistOrderContext, IOrderContainer } from '../../dto';

interface IOrderContainerWithIndex extends IOrderContainer {
	i: number;
}

@Component({
	selector: 'sneat-order-containers-grid',
	templateUrl: './order-containers-grid.component.html',
})
export class OrderContainersGridComponent implements OnChanges {
	protected containers?: IOrderContainer[];

	@Input() order?: ILogistOrderContext;
	@Output() readonly containerSelected = new EventEmitter<IOrderContainer>();

	readonly allCols: IGridColumn[] = [
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
	];

	protected selectedContainer?: IOrderContainer;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly navController: NavController,
		private readonly zone: NgZone,
	) {
	}

	ngOnChanges(/*changes: SimpleChanges*/): void {
		const containers = this.order?.dto?.containers?.map((c, i) => ({ ...c, i: i + 1 }));
		this.containers = containers ? [...containers] : undefined;
	}

	protected readonly rowSelected = (row: unknown) => {
		this.selectedContainer = this.containers?.find(c => c.id === (row as { getData: () => { id: string } }).getData().id);
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
