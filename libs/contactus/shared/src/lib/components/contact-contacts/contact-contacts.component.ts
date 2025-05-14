import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { IContactContext } from '@sneat/contactus-core';
import { ContactEmailsComponent } from './contact-emails.component';
import { ContactPhonesComponent } from './contact-phones.component';

@Component({
	imports: [ContactEmailsComponent, ContactPhonesComponent],
	selector: 'sneat-contact-contacts',
	templateUrl: 'contact-contacts.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactContactsComponent {
	public readonly $contact = input.required<IContactContext | undefined>();
}
