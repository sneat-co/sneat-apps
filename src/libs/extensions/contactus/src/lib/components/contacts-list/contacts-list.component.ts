import { Component, Input } from '@angular/core';
import { IContactContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-contacts-list',
	templateUrl: './contacts-list.component.html',
})
export class ContactsListComponent {
	@Input() contacts?: IContactContext[] = [];

	public id = (i: number, record: { id: string }) => record.id;
}
