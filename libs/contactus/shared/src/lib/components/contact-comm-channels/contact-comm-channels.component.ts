import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { IContactContext } from '@sneat/contactus-core';
import { ContactEmailsComponent } from './contact-emails.component';
import { ContactPhonesComponent } from './contact-phones.component';

@Component({
	imports: [ContactEmailsComponent, ContactPhonesComponent],
	selector: 'sneat-contact-comm-channels',
	templateUrl: 'contact-comm-channels.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactCommChannelsComponent {
	public readonly $contact = input.required<IContactContext>();
}
