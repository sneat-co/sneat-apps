import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IExpressOrderContext, IOrderCounterparty } from '../../dto';


@Component({
	selector: 'sneat-dispatchers',
	templateUrl: './dispatchers.component.html',
})
export class DispatchersComponent implements OnChanges {
	@Input() order?: IExpressOrderContext;
	@Output() readonly orderChange = new EventEmitter<IExpressOrderContext>();

	protected dispatchers?: ReadonlyArray<IOrderCounterparty>;

	constructor(
	) {
		console.log('DispatchersComponent.constructor()');
	}


	ngOnChanges(changes: SimpleChanges): void {
		if (this.order?.dto) {
			this.dispatchers = this.order.dto.counterparties
				?.filter(c => c.role === 'dispatcher') || [];

		} else {
			this.dispatchers = undefined;
		}
		console.log('DispatchersComponent.ngOnChanges', this.order, this.dispatchers);
	}

}
