import { Component, computed, Input, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { addSpace, IContactWithCheck } from '@sneat/contactus-core';
import { ISpaceContext } from '@sneat/space-models';
import { ContactsListItemComponent } from '../contacts-list-item/contacts-list-item.component';

@Component({
	selector: 'sneat-contacts-list',
	templateUrl: './contacts-list.component.html',
	imports: [IonicModule, RouterModule, ContactsListItemComponent],
})
export class ContactsListComponent {
	@Input() public emptyText = 'No contacts';
	public readonly $space = input.required<ISpaceContext>();
	public readonly $contacts = input.required<
		undefined | readonly IContactWithCheck[]
	>();

	protected readonly $contactsWithSpace = computed(() => {
		const space = this.$space();
		return this.$contacts()?.map(addSpace(space)) || [];
	});
}
