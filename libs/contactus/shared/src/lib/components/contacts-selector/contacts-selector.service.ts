import { Injectable } from '@angular/core';
import { SelectorBaseService } from '@sneat/ui';
import { IContactContext } from '@sneat/contactus-core';
import { ContactsSelectorComponent } from './contacts-selector.component';

@Injectable()
export class ContactsSelectorService extends SelectorBaseService<IContactContext> {
	constructor() {
		super(ContactsSelectorComponent);
	}
}
