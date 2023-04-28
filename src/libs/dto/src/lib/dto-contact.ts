import { ContactRole } from './contact-roles';
import { IAddress } from './dto-address';
import { IContact2Asset, IContact2Member } from './dto-contact2';
import { IPersonRecord } from './dto-models';
import { IPersonBase, IRelatedPerson } from './dto-person';

export type ContactType = 'person' | 'company' | 'location' | 'vehicle';

export interface IContactBase extends IPersonBase {
	type: ContactType;
	address?: IAddress;
	// title: string; // Mandatory title
	roles?: ContactRole[];
}

export interface IRelatedPersonContact extends IRelatedPerson {
	type: 'person';
}

export interface IContactBrief extends IContactBase {
	id: string;
	title: string;
	parentID?: string;
}


export interface IContactDto extends IContactBase, IPersonRecord {
	roles?: ContactRole[];
	members?: IContact2Member[]; // TODO: document purpose, use cases, examples of usage
	assets?: IContact2Asset[];  // TODO: document purpose, use cases, examples of usage
	relatedContacts?: IContactBrief[];
}

export interface IContactsBrief {
	contacts?: IContactBrief[];
}
