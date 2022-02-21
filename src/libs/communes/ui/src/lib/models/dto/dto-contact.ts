import {ContactToMemberRelation, ContactType} from '../types';
import {IPersonRecord} from './dto-models';
import {RxRecordKey} from 'rxstore';

export interface IContact2Member {
	id: RxRecordKey; // TODO: Change to string
	title: string;
	relation: ContactToMemberRelation;
}

export interface IContact2Asset {
	id: RxRecordKey; // TODO: Change to string
	title: string;
	relation: ContactType;
}

export interface IContactDto extends IPersonRecord { // TODO: Rename to IContactDto
	title: string; // Mandatory title
	roles?: string[];
	members?: IContact2Member[];
	assets?: IContact2Asset[];
}
