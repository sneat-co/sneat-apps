import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { IContactContext } from '@sneat/team-models';

@Component({
	selector: 'sneat-contact-contacts',
	templateUrl: 'contact-contacts.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule],
})
export class ContactContactsComponent {
	@Input({ required: true }) public contact?: IContactContext;
}
