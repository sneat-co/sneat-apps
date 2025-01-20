import { Component, Input } from '@angular/core';
import { IIdAndBrief } from '@sneat/core';
import { IContactBrief } from '@sneat/contactus-core';
import { ISpaceContext } from '@sneat/team-models';

@Component({
	selector: 'sneat-contacts-list',
	templateUrl: './contacts-list.component.html',
	standalone: false,
})
export class ContactsListComponent {
	@Input({ required: true }) space?: ISpaceContext;
	@Input({ required: true }) contacts?: IIdAndBrief<IContactBrief>[] = [];
}
