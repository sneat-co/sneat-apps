import { Directive, EventEmitter, input, Output } from '@angular/core';
import { ContactDboWithSpaceRef } from '@sneat/contactus-core';
import { WithSpaceInput } from '@sneat/space-services';
import { SneatBaseComponent } from '@sneat/ui';

@Directive()
export abstract class ContactFormBaseComponent extends WithSpaceInput {
	// Should $hideRole be in NewContactFormBaseComponent?
	public readonly $hideRole = input<boolean>();
}

@Directive()
export abstract class EditContactFormBaseComponent extends ContactFormBaseComponent {
	public readonly $contact = input.required<ContactDboWithSpaceRef>();

	@Output() readonly contactChange = new EventEmitter<ContactDboWithSpaceRef>();
}
