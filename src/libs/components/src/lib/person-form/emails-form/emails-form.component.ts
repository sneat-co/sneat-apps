import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IEmail } from '@sneat/dto';

type EmailType = 'personal' | 'work';

const emailTypes: { id: EmailType, title: string }[] = [
	{ id: 'personal', title: 'Personal' },
	{ id: 'work', title: 'Work' },
];

interface emailInput {
	type: EmailType;
	address: string;
}

const emptyEmails: emailInput[] = [
	{ type: 'personal', address: '' },
	{ type: 'work', address: '' },
];

@Component({
	selector: 'sneat-emails-form',
	templateUrl: './emails-form.component.html',
})
export class EmailsFormComponent implements OnChanges {
	readonly types = emailTypes;

	@Input() isActiveInWizard = false;
	@Input() disabled = false;

	emailInputs: readonly emailInput[] = emptyEmails;

	@Input() emails?: IEmail[];
	@Output() readonly emailsChange = new EventEmitter<IEmail[]>();

	ngOnChanges(changes: SimpleChanges): void {
		const emailsChange = changes['emails'];
		console.log('EmailsFormComponent.ngOnChanges(), emailsChange', emailsChange);
		if (emailsChange && (this.emails?.length || 0) === 0) {
			this.emailInputs = emptyEmails;
		}
	}

	typeChanged(event: Event, i: number): void {
		event.stopPropagation();
		this.setEmailsOnInputChanged();
	}

	addressChanged(event: Event): void {
		event.stopPropagation();
		console.log('addressChanged')
		this.setEmailsOnInputChanged();
	}

	private setEmailsOnInputChanged(): void {
		console.log('setEmailsOnInputChanged()', this.emailInputs);
		this.emails = [...this.emailInputs].filter(email => !!email.address);
		if (this.emails.length === 0) {
			this.emails = undefined;
		}
		this.emailsChange.emit(this.emails);
	}
}
