import { Directive, EventEmitter, input, Output } from '@angular/core';
import { IContactContext } from '@sneat/contactus-core';
import { SneatBaseComponent } from '@sneat/ui';

@Directive()
export abstract class ContactFormBaseComponent extends SneatBaseComponent {
	public readonly $hideRole = input<boolean>();

	// In the $contact we accumulate all the data we need to create a new contact
	public readonly $contact = input.required<IContactContext>();

	@Output() readonly contactChange = new EventEmitter<IContactContext>();
}
