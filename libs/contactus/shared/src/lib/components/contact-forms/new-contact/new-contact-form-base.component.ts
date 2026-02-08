import {
	computed,
	Directive,
	EventEmitter,
	input,
	Output,
} from '@angular/core';
import {
	ContactIdAndDboWithSpaceRef,
	IEmail,
	IPhone,
	NewContactBaseDboAndSpaceRef,
} from '@sneat/contactus-core';
import { ContactFormBaseComponent } from '../contact-form-base.component';

@Directive()
export abstract class NewContactFormBaseComponent extends ContactFormBaseComponent {
	// In the $contact we accumulate all the data we need to create a new contact
	public readonly $contact = input.required<NewContactBaseDboAndSpaceRef>();
	protected readonly $contactType = computed(() => this.$contact().dbo.type);

	protected readonly $emails = computed<IEmail[]>(() => {
		const emails = this.$contact().dbo.emails;
		return Object.entries(emails || {}).map(([address, props]) =>
			Object.assign({ address }, props),
		);
	});

	protected readonly $phones = computed<IPhone[]>(() => {
		const phones = this.$contact().dbo.phones;
		return Object.entries(phones || {}).map(([number, props]) =>
			Object.assign({ number }, props),
		);
	});

	@Output() readonly contactChange =
		new EventEmitter<NewContactBaseDboAndSpaceRef>();

	@Output() public readonly creatingChange = new EventEmitter<boolean>();
	@Output() public readonly contactCreated =
		new EventEmitter<ContactIdAndDboWithSpaceRef>();
}
