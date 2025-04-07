import { Injectable } from '@angular/core';
import { SelectorBaseService } from '@sneat/ui';
import { IContactWithBriefAndSpace } from '@sneat/contactus-core';
import { ContactsSelectorComponent } from './contacts-selector.component';
import { IContactSelectorOptions } from './contacts-selector.interfaces';

@Injectable()
export class ContactsSelectorService extends SelectorBaseService<IContactWithBriefAndSpace> {
	constructor() {
		super(ContactsSelectorComponent);
	}

	public async selectMultipleContacts(options: IContactSelectorOptions) {
		return this.selectMultipleInModal(options);
	}
}
