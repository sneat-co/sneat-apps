import { ContactRole } from './contact-roles';
import { ContactToAssetRelation, ContactToMemberRelation} from './types';
import { IWithIdAndTitle } from './dto-brief';

export interface IContact2Member extends IWithIdAndTitle {
	relation: ContactToMemberRelation;
}

export interface IContact2Asset extends IWithIdAndTitle {
	relation: ContactToAssetRelation;
}
