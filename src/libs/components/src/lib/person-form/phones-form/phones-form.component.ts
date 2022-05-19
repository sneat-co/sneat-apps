import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IPhone } from '@sneat/dto';

type PhoneType = 'personal' | 'mobile' | 'work' | 'fax' | 'landline';

const phoneTypes: { id: PhoneType, title: string }[] = [
	{ id: 'personal', title: 'Personal' },
	{ id: 'mobile', title: 'Mobile' },
	{ id: 'landline', title: 'Landline' },
	{ id: 'work', title: 'Work' },
	{ id: 'fax', title: 'Fax' },
];

const emptyPhones: IPhone[] = [
	{ type: 'personal', number: '' },
	{ type: 'work', number: '' },
];
@Component({
	selector: 'sneat-phones-form',
	templateUrl: './phones-form.component.html',
})
export class PhonesFormComponent implements OnChanges {

	@Input() disabled = false;

	readonly types = phoneTypes;

	@Input() phones?: IPhone[] = emptyPhones;
	@Output() readonly phonesChange = new EventEmitter<IPhone[]>();

	ngOnChanges(changes: SimpleChanges): void {
		const phonesChange = changes['phones'];
		if (phonesChange && !phonesChange.currentValue) {
			this.phones = emptyPhones;
		}
	}

	typeChanged(event: Event, i: number): void {
		event.stopPropagation();
		if (this.phones) {
			this.phones[i] = {...this.phones[i], type: (event as CustomEvent).detail.value};
		}
	}

	numberChanged(event: Event, i: number): void {
		event.stopPropagation();
		if (this.phones) {
			this.phones[i] = { ...this.phones[i], number: (event as CustomEvent).detail.value };
		}
	}

}
