import { Component, Input } from '@angular/core';

type PhoneType = 'personal' | 'mobile' | 'work' | 'fax' | 'landline';

interface phone {
	type: PhoneType;
	number: string;
}

const phoneTypes: { id: PhoneType, title: string }[] = [
	{ id: 'personal', title: 'Personal' },
	{ id: 'mobile', title: 'Mobile' },
	{ id: 'landline', title: 'Landline' },
	{ id: 'work', title: 'Work' },
	{ id: 'fax', title: 'Fax' },
];

@Component({
	selector: 'sneat-phones-form',
	templateUrl: './phones-form.component.html',
})
export class PhonesFormComponent {

	@Input() disabled = false;

	readonly types = phoneTypes;

	readonly phones: phone[] = [
		{ type: 'personal', number: '' },
		{ type: 'work', number: '' },
	];
}
