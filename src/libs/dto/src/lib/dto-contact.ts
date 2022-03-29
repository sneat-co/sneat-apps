import { IPersonRecord } from './dto-models';
import { IContact2Asset, IContact2Member } from './dto-contact2';

export interface IContactDto extends IPersonRecord {
	title: string; // Mandatory title
	roles?: string[];
	members?: IContact2Member[]; // TODO: document purpose, use cases, examples of usage
	assets?: IContact2Asset[];  // TODO: document purpose, use cases, examples of usage
}
