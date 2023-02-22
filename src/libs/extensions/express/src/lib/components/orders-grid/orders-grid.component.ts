import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { NavController } from '@ionic/angular';
import { IGridColumn } from '@sneat/grid';
import { ITeamContext } from '@sneat/team/models';
import { IExpressOrderContext, IOrderCounterpartyRef } from '../../dto/order-dto';

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
	selector: 'sneat-express-orders-grid',
	templateUrl: './orders-grid.component.html',
	styleUrls: ['./orders-grid.component.scss'],
})
export class OrdersGridComponent implements OnChanges {

	@Input() team?: ITeamContext;
	@Input() orders?: IExpressOrderContext[];

	rows?: OrderRow[];

	allCols: IGridColumn[] = [
		{
			field: 'id',
			dbType: 'string',
			title: '#',
		},
		{
			field: 'status',
			dbType: 'string',
			title: 'Status',
		},
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
			title: 'Carrier',
		},
		{
			field: 'containers',
			dbType: 'string',
			title: 'Containers',
		},
	];

	displayCols = this.allCols;

	constructor(
		private readonly navController: NavController,
	) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['orders']) {
			this.rows = this.orders?.map(o => ({
				id: o.id,
				status: o.brief?.status,
				direction: o.brief?.direction,
				carrier: o.dto?.counterparties?.find(c => c.role === 'carrier'),
				buyer: o.dto?.counterparties?.find(c => c.role === 'buyer'),
				consignee: o.dto?.counterparties?.find(c => c.role === 'consignee'),
				containers: o.dto?.containers?.length?.toString(),
			}));
		}
	}

	readonly rowClick = (event: Event, row: unknown) => {
		console.log('OrdersGridComponent.rowClick():', event, row);
		if (!this.team) {
			alert('No team context provided!');
			return;
		}
		const data = (row as {getData: () => {id: string}}).getData();
		this.navController
			.navigateForward(['space', this.team.type, this.team.id, 'order', data.id])
			.catch(console.error);
	}
}
