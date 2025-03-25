import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IIdAndBrief } from '@sneat/core';
import { IContactBrief } from '@sneat/contactus-core';
import { ISpaceContext } from '@sneat/space-models';
import { ContactsListItemComponent } from '../contacts-list-item/contacts-list-item.component';

@Component({
	selector: 'sneat-contacts-list',
	templateUrl: './contacts-list.component.html',
	imports: [IonicModule, RouterModule, ContactsListItemComponent],
})
export class ContactsListComponent {
	@Input({ required: true }) space?: ISpaceContext;
	@Input({ required: true }) contacts?: IIdAndBrief<IContactBrief>[] = [];
}
