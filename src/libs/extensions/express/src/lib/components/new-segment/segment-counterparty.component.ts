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
	@Input() endpointType?: SegmentEndpointType;
	@Input() readonly = false;

	@Input() contact?: IContactContext;
	@Output() readonly contactChange = new EventEmitter<IContactContext>;

	@Input() date = '';
	@Output() readonly dateChange = new EventEmitter<string>;

	@Input() refNumber = '';
	@Output() readonly refNumberChange = new EventEmitter<string>();

	@Output() readonly endpointTypeChange = new EventEmitter<SegmentEndpointType>();

	onEndpointTypeChanged(event: Event): void {
		console.log('onEndpointTypeChanged', event);
		const ce = event as CustomEvent;
		if (!ce.detail.value) {
			return; // Prevent emitting on initial load
		}
		this.endpointTypeChange.emit(this.endpointType);
	}

	onContactChanged(contact: IContactContext): void {
		console.log('SegmentCounterpartyComponent.onContactChanged', contact);
		this.contactChange.emit(contact);
	}

	onDateChanged(): void {
		this.dateChange.emit(this.date);
	}

	onRefNumberChanged(): void {
		this.refNumberChange.emit(this.refNumber);
	}
}
