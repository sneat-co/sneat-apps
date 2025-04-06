import { Injectable } from '@angular/core';
import { SelectorBaseService } from '@sneat/ui';
import { IContactWithSpace } from '@sneat/contactus-core';
import { ContactsSelectorComponent } from './contacts-selector.component';
import { IContactSelectorOptions } from './contacts-selector.interfaces';

@Injectable()
export class ContactsSelectorService extends SelectorBaseService<IContactWithSpace> {
	constructor() {
		super(ContactsSelectorComponent);
	}

	public async selectMultipleContacts(options: IContactSelectorOptions) {
		return this.selectMultipleInModal(options);
	}
}
