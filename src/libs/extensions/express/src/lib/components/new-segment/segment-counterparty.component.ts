import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IContactContext } from '@sneat/team/models';
import { IExpressOrderContext } from '../../dto';

export type SegmentEndpointType = 'port' | 'dispatcher';

@Component({
	selector: 'sneat-segment-counterparty',
	templateUrl: './segment-counterparty.component.html',
})
export class SegmentCounterpartyComponent {
	@Input() endpointDirection?: 'from' | 'to';
	@Input() order?: IExpressOrderContext;
	@Input() contact?: IContactContext;
	@Input() endpointType?: SegmentEndpointType;
	@Input() readonly = false;

	@Input() date = '';

	@Output() endpointTypeChange = new EventEmitter<SegmentEndpointType>();
	@Output() dateChange = new EventEmitter<string>;
	@Output() contactChange = new EventEmitter<IContactContext>;

	onEndpointTypeChanged(event: Event): void {
		console.log('onEndpointTypeChanged', event);
		const ce = event as CustomEvent;
		if (!ce.detail.value) {
			return; // Prevent emitting on initial load
		}
		this.endpointTypeChange.emit(this.endpointType);
	}

	onContactChanged(contact: IContactContext): void {
		this.contactChange.emit(contact);
	}

	onDateChanged(): void {
		this.dateChange.emit(this.date);
	}
}
