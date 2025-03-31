import { Injectable } from '@angular/core';
import { SelectorBaseService } from '@sneat/ui';
import { IContactWithSpace } from '@sneat/contactus-core';
import { ContactsSelectorComponent } from './contacts-selector.component';

@Injectable()
export class ContactsSelectorService extends SelectorBaseService<IContactWithSpace> {
	constructor() {
		super(ContactsSelectorComponent);
	}
}
