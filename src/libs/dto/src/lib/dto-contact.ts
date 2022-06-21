import { IWithIdAndTitle } from './dto-brief';
import { IContact2Asset, IContact2Member } from './dto-contact2';
import { IPersonRecord } from './dto-models';
import { IPersonBase } from './dto-person';

export interface IContactBase extends IPersonBase {
	// title: string; // Mandatory title
	roles?: string[];
}

export interface IContactBrief extends IContactBase {
	id: string;
}


export interface IContactDto extends IContactBase, IPersonRecord {
	roles?: string[];
	members?: IContact2Member[]; // TODO: document purpose, use cases, examples of usage
	assets?: IContact2Asset[];  // TODO: document purpose, use cases, examples of usage
}
