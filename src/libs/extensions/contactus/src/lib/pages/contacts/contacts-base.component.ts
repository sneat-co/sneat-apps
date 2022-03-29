import {Input} from '@angular/core';
import {IContactDto} from '../../../../models/dto/dto-contact';

export interface IContactGroup {
	title: string;
	roles: IContactRole[];
}

export interface IContactRole {
	id: string;
	title: string;
	emoji?: string;
	contacts?: IContactDto[];
	finder?: string;
}

export abstract class ContactsBaseComponent {
	@Input() goContact: (contact: IContactDto) => void;
	@Input() goMember: (memberId: string, event: Event) => void;
}
