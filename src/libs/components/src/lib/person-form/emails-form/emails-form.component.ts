import { Component, Input } from '@angular/core';

type EmailType = 'personal' | 'work';

interface email {
	type: EmailType;
	address: string;
}

const emailTypes: { id: EmailType, title: string }[] = [
	{ id: 'personal', title: 'Personal' },
	{ id: 'work', title: 'Work' },
];

@Component({
	selector: 'sneat-emails-form',
	templateUrl: './emails-form.component.html',
})
export class EmailsFormComponent {
	@Input() disabled = false;

	readonly types = emailTypes;
	readonly emails: email[] = [
		{ type: 'personal', address: '' },
		{ type: 'work', address: '' },
	];

}
