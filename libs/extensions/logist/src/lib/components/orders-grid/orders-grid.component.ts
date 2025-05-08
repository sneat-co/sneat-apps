import { NgIf } from '@angular/common';
import {
	Component,
	Inject,
	Input,
	NgZone,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import {
	IonCard,
	IonCardContent,
	NavController,
} from '@ionic/angular/standalone';
import { DataGridComponent } from '@sneat/datagrid';
import { IGridColumn } from '@sneat/grid';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/space-models';
import {
	ILogistOrderContext,
	IOrderCounterpartyRef,
} from '../../dto/order-dto';

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
	imports: [IonCard, IonCardContent, DataGridComponent, NgIf],
})
export class OrdersGridComponent implements OnChanges {
	@Input({ required: true }) space?: ISpaceContext;
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
			field: 'receive_agent.title',
			dbType: 'string',
			title: `Buyer's agent`,
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
			title: 'Points',
			hozAlign: 'right',
			headerHozAlign: 'right',
			width: 100,
			widthShrink: 1,
		},
		{
			field: 'segments',
			dbType: 'string',
			title: 'Segments',
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
	) {}

	ngOnChanges(changes: SimpleChanges): void {
		console.log('OrdersGridComponent.ngOnChanges():', changes);
		if (changes['orders']) {
			this.rows = this.orders?.map((o) => ({
				id: o.id,
				status: o.brief?.status,
				direction: o.brief?.direction,
				dispatch_agent: o.dbo?.counterparties?.find(
					(c) => c.role === 'dispatch_agent',
				),
				receive_agent: o.dbo?.counterparties?.find(
					(c) => c.role === 'receive_agent',
				),
				buyer: o.dbo?.counterparties?.find((c) => c.role === 'buyer'),
				consignee: o.dbo?.counterparties?.find((c) => c.role === 'consignee'),
				containers: o.dbo?.containers?.length?.toString(),
				shippingPoints: o.dbo?.shippingPoints?.length?.toString(),
				segments: o.dbo?.segments?.length?.toString(),
			}));
		}
	}

	protected readonly rowClick = (event: Event, row: unknown) => {
		console.log('OrdersGridComponent.rowClick():', event, row);
		if (!this.space) {
			alert('No team context provided!');
			return;
		}
		const data = (row as { getData: () => { id: string } }).getData();
		const space = this.space;
		if (!space) {
			alert('No space context provided!');
			return;
		}
		this.zone
			.run(() =>
				this.navController
					.navigateForward(['space', space.type, space.id, 'order', data.id])
					.catch(
						this.errorLogger.logErrorHandler(
							'Failed to navigate to order details page',
						),
					),
			)
			.then(() => void 0);
	};
}
