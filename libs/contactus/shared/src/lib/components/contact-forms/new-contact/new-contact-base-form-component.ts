import { Directive, input } from '@angular/core';
import { ContactType, IContactContext } from '@sneat/contactus-core';
import { WithSpaceInput } from '@sneat/space-components';

@Directive()
export class NewContactBaseFormComponent extends WithSpaceInput {
	// We might want to limit contact type to some specific values like company or location for example.
	public $contactType = input.required<ContactType | undefined>();

	// This is used to hide the role selector in the form
	public readonly $hideRole = input<boolean>();

	// In the $contact we accumulate all the data we need to create a new contact
	public readonly $contact = input<IContactContext>();
}
