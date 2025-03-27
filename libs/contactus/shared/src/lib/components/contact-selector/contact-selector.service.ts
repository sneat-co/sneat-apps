import { Injectable } from '@angular/core';
import { ISelectorOptions, SelectorBaseService } from '@sneat/ui';
import { IContactContext } from '@sneat/contactus-core';
import { ContactSelectorComponent } from './contact-selector.component';
import { IContactSelectorProps } from './contact-selector.interfaces';

export interface IContactSelectorOptions
	extends ISelectorOptions<IContactContext> {
	readonly componentProps?: IContactSelectorProps;
}

export interface ISelectedContact {
	readonly contact: IContactContext;
	readonly role: string;
}

@Injectable()
export class ContactSelectorService extends SelectorBaseService<IContactContext> {
	constructor() {
		super(ContactSelectorComponent);
	}
}
