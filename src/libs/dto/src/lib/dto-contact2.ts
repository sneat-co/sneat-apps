import { ContactToMemberRelation, ContactType } from './types';
import { IBriefWithIdAndTitle } from './dto-brief';

export interface IContact2Member extends IBriefWithIdAndTitle {
	relation: ContactToMemberRelation;
}

export interface IContact2Asset extends IBriefWithIdAndTitle {
	relation: ContactType;
}
