import { IWithIdAndTitle } from './dto-brief';
import { IContact2Asset, IContact2Member } from './dto-contact2';
import { IPersonRecord } from './dto-models';
import { IPersonBase, IRelatedPerson } from './dto-person';

export type ContactType = 'person' | 'company' | 'location';

export interface IContactBase extends IPersonBase {
	type: ContactType;
	// title: string; // Mandatory title
	roles?: string[];
}

export interface IRelatedPersonContact extends IRelatedPerson {
	type: 'person';
}

export interface IContactBrief extends IContactBase {
	id: string;
}



export interface IContactDto extends IContactBase, IPersonRecord {
	address?: string;
	roles?: string[];
	members?: IContact2Member[]; // TODO: document purpose, use cases, examples of usage
	assets?: IContact2Asset[];  // TODO: document purpose, use cases, examples of usage
	relatedContacts?: IContactBrief[];
}
