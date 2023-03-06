import { Component, Inject, Input, NgZone, OnChanges } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IGridColumn } from '@sneat/grid';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ILogistOrderContext, IOrderContainer } from '../../dto';


@Component({
	selector: 'sneat-order-containers-grid',
	templateUrl: './order-containers-grid.component.html',
})
export class OrderContainersGridComponent implements OnChanges {
	protected containers?: IOrderContainer[];

	@Input() order?: ILogistOrderContext;

	allCols: IGridColumn[] = [
		{
			field: 'type',
			dbType: 'string',
			title: 'Size',
		},
		{
			field: 'number',
			dbType: 'string',
			title: 'Number',
		},
		{
			field: 'loadPointsCount',
			dbType: 'number',
			title: 'Load points',
		},
		{
			field: 'unloadPointsCount',
			dbType: 'number',
			title: 'Unload points',
		},
		{
			field: 'segmentsCount',
			dbType: 'number',
			title: 'Segments',
		},
		{
			field: 'numberOfPallets',
			dbType: 'number',
			title: 'Pallets',
		},
		{
			field: 'grossWeightKg',
			dbType: 'number',
			title: 'Gross weights (kg)',
		},
		{
			field: 'volumeM3',
			dbType: 'number',
			title: 'Volume (m3)',
		},
	];

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly navController: NavController,
		private readonly zone: NgZone,
	) {
	}

	ngOnChanges(/*changes: SimpleChanges*/): void {
		const containers = this.order?.dto?.containers;
		this.containers = containers ? [...containers] : undefined;
	}

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
