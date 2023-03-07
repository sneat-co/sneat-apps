import { Component, Inject, Input, NgZone, OnChanges, SimpleChanges } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IGridColumn } from '@sneat/grid';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team/models';
import { ILogistOrderContext, IOrderCounterpartyRef } from '../../dto/order-dto';

interface OrderRow {
	readonly id: string;
	readonly status?: string;
	readonly direction?: string;
	readonly carrier?: IOrderCounterpartyRef;
	readonly buyer?: IOrderCounterpartyRef;
	readonly consignee?: IOrderCounterpartyRef;
	readonly containers?: string;
}

@Component({
	selector: 'sneat-logist-orders-grid',
	templateUrl: './orders-grid.component.html',
	styleUrls: ['./orders-grid.component.scss'],
})
export class OrdersGridComponent implements OnChanges {

	@Input() team?: ITeamContext;
	@Input() orders?: ILogistOrderContext[];

	rows?: OrderRow[];

	allCols: IGridColumn[] = [
		{
			field: 'id',
			dbType: 'string',
			title: '#',
			hozAlign: 'right',
			headerHozAlign: 'right',
			width: 50,
			widthShrink: 2,
		},
		// {
		// 	field: 'status',
		// 	dbType: 'string',
		// 	title: 'Status',
		// },
		{
			field: 'direction',
			dbType: 'string',
			title: 'Direction',
		},
		{
			field: 'consignee.title',
			dbType: 'string',
			title: 'Consignee',
		},
		{
			field: 'buyer.title',
			dbType: 'string',
			title: 'Buyer',
		},
		{
			field: 'carrier.title',
			dbType: 'string',
			title: 'Carrier(s)',
		},
		{
			field: 'containers',
			dbType: 'string',
			title: 'Containers',
			hozAlign: 'right',
			headerHozAlign: 'right',
			width: 100,
			widthShrink: 1,
		},
		{
			field: 'shippingPoints',
			dbType: 'string',
			title: 'Load points',
			hozAlign: 'right',
			headerHozAlign: 'right',
			width: 100,
			widthShrink: 1,
		},
	];

	displayCols = this.allCols;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly navController: NavController,
		private readonly zone: NgZone,
	) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		console.log('OrdersGridComponent.ngOnChanges():', changes);
		if (changes['orders']) {
			this.rows = this.orders?.map(o => ({
				id: o.id,
				status: o.brief?.status,
				direction: o.brief?.direction,
				carrier: o.dto?.counterparties?.find(c => c.role === 'carrier'),
				buyer: o.dto?.counterparties?.find(c => c.role === 'buyer'),
				consignee: o.dto?.counterparties?.find(c => c.role === 'consignee'),
				containers: o.dto?.containers?.length?.toString(),
				shippingPoints: o.dto?.shippingPoints?.length?.toString(),
			}));
		}
	}

	protected readonly rowClick = (event: Event, row: unknown) => {
		console.log('OrdersGridComponent.rowClick():', event, row);
		if (!this.team) {
			alert('No team context provided!');
			return;
		}
		const data = (row as { getData: () => { id: string } }).getData();
		const team = this.team;
		if (!team) {
			alert('No team context provided!');
			return;
		}
		this.zone.run(() => this.navController
			.navigateForward(['space', team.type, team.id, 'order', data.id])
			.catch(this.errorLogger.logErrorHandler('Failed to navigate to order details page')))
			.then(() => void 0)
		;
	};
}
