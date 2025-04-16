import {
	computed,
	Directive,
	EventEmitter,
	input,
	Output,
} from '@angular/core';
import {
	ContactIdAndDboWithSpaceRef,
	NewContactBaseDboAndSpaceRef,
} from '@sneat/contactus-core';
import { ContactFormBaseComponent } from '../contact-form-base.component';

@Directive()
export abstract class NewContactFormBaseComponent extends ContactFormBaseComponent {
	// In the $contact we accumulate all the data we need to create a new contact
	public readonly $contact = input.required<NewContactBaseDboAndSpaceRef>();
	protected readonly $contactType = computed(() => this.$contact().dbo.type);
	protected readonly $spaceRef = computed(() => this.$contact().space);
	protected readonly $spaceID = computed(() => this.$spaceRef().id);

	@Output() readonly contactChange =
		new EventEmitter<NewContactBaseDboAndSpaceRef>();

	@Output() public readonly creatingChange = new EventEmitter<boolean>();
	@Output() public readonly contactCreated =
		new EventEmitter<ContactIdAndDboWithSpaceRef>();
}
