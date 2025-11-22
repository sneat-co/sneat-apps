import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import { IonCard, IonItemDivider } from '@ionic/angular/standalone';
import { ILogistOrderContext, IOrderCounterparty } from '../../dto';
import { DispatcherComponent } from './dispatcher.component';

@Component({
	selector: 'sneat-dispatchers',
	templateUrl: './dispatchers.component.html',
	imports: [IonItemDivider, DispatcherComponent, IonCard],
})
export class DispatchersComponent implements OnChanges {
	@Input() order?: ILogistOrderContext;
	@Output() readonly orderChange = new EventEmitter<ILogistOrderContext>();

	protected dispatchers?: readonly IOrderCounterparty[];

	protected readonly counterpartyKey = (i: number, c: IOrderCounterparty) =>
		`${c.contactID}&${c.role}`;

	constructor() {
		console.log('DispatchersComponent.constructor()');
	}

	ngOnChanges(changes: SimpleChanges): void {
		console.log('DispatchersComponent.ngOnChanges', changes);
		if (this.order?.dbo) {
			this.dispatchers =
				this.order.dbo.counterparties?.filter((c) => c.role === 'dispatcher') ||
				[];
		} else {
			this.dispatchers = undefined;
		}
		console.log(
			'DispatchersComponent.ngOnChanges',
			this.order,
			this.dispatchers,
		);
	}
}
