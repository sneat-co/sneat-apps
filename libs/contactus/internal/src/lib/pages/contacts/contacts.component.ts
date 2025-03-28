import { Component, input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ContactRole } from '@sneat/contactus-core';
import { ISpaceContext } from '@sneat/space-models';

@Component({
	selector: 'sneat-contacts',
	templateUrl: './contacts.component.html',
	imports: [IonicModule],
})
export class ContactsComponent {
	public readonly $space = input.required<ISpaceContext>();
	public readonly $role = input<undefined | ContactRole>();
}
