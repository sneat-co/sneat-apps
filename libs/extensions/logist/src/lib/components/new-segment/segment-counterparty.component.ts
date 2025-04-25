import { NgIf, TitleCasePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	IonCard,
	IonInput,
	IonItem,
	IonItemDivider,
	IonLabel,
	IonSegment,
	IonSegmentButton,
} from '@ionic/angular/standalone';
import { IContactContext } from '@sneat/contactus-core';
import { ContactInputComponent } from '@sneat/contactus-shared';
import { ILogistOrderContext } from '../../dto';

export type SegmentEndpointType = 'port' | 'dispatcher';

@Component({
	selector: 'sneat-segment-counterparty',
	templateUrl: './segment-counterparty.component.html',
	imports: [
		IonCard,
		IonItemDivider,
		IonLabel,
		IonSegment,
		TitleCasePipe,
		FormsModule,
		IonSegmentButton,
		ContactInputComponent,
		IonItem,
		IonInput,
		NgIf,
	],
})
export class SegmentCounterpartyComponent {
	@Input() endpointDirection?: 'from' | 'to';
	@Input() order?: ILogistOrderContext;
	@Input() endpointType?: SegmentEndpointType;
	@Input() readonly = false;

	@Input() contact?: IContactContext;
	@Output() readonly contactChange = new EventEmitter<IContactContext>();

	@Input() date = '';
	@Output() readonly dateChange = new EventEmitter<string>();

	@Input() refNumber = '';
	@Output() readonly refNumberChange = new EventEmitter<string>();

	@Output() readonly endpointTypeChange =
		new EventEmitter<SegmentEndpointType>();

	onEndpointTypeChanged(event: Event): void {
		console.log('onEndpointTypeChanged', event);
		const ce = event as CustomEvent;
		if (!ce.detail.value) {
			return; // Prevent emitting on initial load
		}
		this.endpointTypeChange.emit(this.endpointType);
	}

	onContactChanged(contact?: IContactContext): void {
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
