import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { IGridColumn } from '@sneat/grid';
import { ITeamContext } from '@sneat/team/models';
import { IExpressOrderContext, IOrderCounterparty } from '../../dto/order-dto';

interface OrderRow {
	readonly id: string;
	readonly status?: string;
	readonly direction?: string;
	readonly carrier?: IOrderCounterparty;
	readonly buyer?: IOrderCounterparty;
	readonly consignee?: IOrderCounterparty;
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

	rowClick = (event: Event, row: unknown) => {
		console.log('rowClick:', row);
	}
}
