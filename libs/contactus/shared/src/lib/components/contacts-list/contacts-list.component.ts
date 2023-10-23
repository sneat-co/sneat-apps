import { Component, Input } from '@angular/core';
import { IIdAndBrief } from '@sneat/core';
import { IContactBrief } from '@sneat/dto';

@Component({
	selector: 'sneat-contacts-list',
	templateUrl: './contacts-list.component.html',
})
export class ContactsListComponent {
	@Input() contacts?: IIdAndBrief<IContactBrief>[] = [];

	protected readonly id = (_: number, o: IIdAndBrief<IContactBrief>) => o.id;
}
