import { ContactToMemberRelation, ContactType } from './types';
import { IBrief } from './dto-brief';

export interface IContact2Member extends IBrief {
	relation: ContactToMemberRelation;
}

export interface IContact2Asset extends IBrief {
	relation: ContactType;
}
