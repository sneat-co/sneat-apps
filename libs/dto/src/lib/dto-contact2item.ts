import { ContactToAssetRelation, ContactToContactRelation } from './types';
import { IWithIdAndTitle } from './dto-brief';

// This is a DTO object to be used in request and NOT to be used in DB records
export interface IContact2ContactInRequest {
	relation: ContactToContactRelation;
}

export interface IContact2Asset extends IWithIdAndTitle {
	relation: ContactToAssetRelation;
}
