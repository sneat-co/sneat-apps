import { Injectable } from '@angular/core';
import { ISelectorOptions, SelectorBaseService } from '@sneat/ui';
import { IContactContext } from '@sneat/contactus-core';
import { ContactSelectorComponent } from './contact-selector.component';
import { IContactSelectorProps } from './contact-selector.interfaces';

@Injectable()
export class ContactSelectorService extends SelectorBaseService<IContactContext> {
	constructor() {
		super(ContactSelectorComponent);
	}
}
