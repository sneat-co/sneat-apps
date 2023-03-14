import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ILogistOrderContext, IOrderCounterparty } from '../../dto';


@Component({
	selector: 'sneat-dispatchers',
	templateUrl: './dispatchers.component.html',
})
export class DispatchersComponent implements OnChanges {
	@Input() order?: ILogistOrderContext;
	@Output() readonly orderChange = new EventEmitter<ILogistOrderContext>();

	protected dispatchers?: ReadonlyArray<IOrderCounterparty>;

	protected readonly counterpartyKey = (i: number, c: IOrderCounterparty) => `${c.contactID}&${c.role}`;

	constructor() {
		console.log('DispatchersComponent.constructor()');
	}


	ngOnChanges(changes: SimpleChanges): void {
		console.log('DispatchersComponent.ngOnChanges', changes);
		if (this.order?.dto) {
			this.dispatchers = this.order.dto.counterparties
				?.filter(c => c.role === 'dispatcher') || [];

		} else {
			this.dispatchers = undefined;
		}
		console.log('DispatchersComponent.ngOnChanges', this.order, this.dispatchers);
	}

}
