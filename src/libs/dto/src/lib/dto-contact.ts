import { ContactToMemberRelation, ContactType } from './types';
import { IPersonRecord } from './dto-models';

export interface IContactBrief {
	id: string;
	title: string;
}

export interface IContact2Member extends IContactBrief {
	relation: ContactToMemberRelation;
}

export interface IContact2Asset extends IContactBrief {
	relation: ContactType;
}

export interface IContactDto extends IPersonRecord {
	title: string; // Mandatory title
	roles?: string[];
	members?: IContact2Member[]; // TODO: document purpose, use cases, examples of usage
	assets?: IContact2Asset[];  // TODO: document purpose, use cases, examples of usage
}
