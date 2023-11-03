import { AgeGroupID, IRelatedToRequest } from '@sneat/contactus-core';
import { IAddress } from '@sneat/contactus-core';
import { ITeamRequest } from '@sneat/team-models';

export interface IContactRequest extends ITeamRequest {
	readonly contactID: string;
}

export interface IUpdateContactRequest extends IContactRequest {
	readonly address?: IAddress;
	readonly ageGroup?: AgeGroupID;
	readonly roles?: ISetContactRolesRequest;
	readonly relatedTo?: IRelatedToRequest;
}

export interface ISetContactRolesRequest {
	readonly add?: readonly string[];
	readonly remove?: readonly string[];
}

export interface ISetContactsStatusRequest extends ITeamRequest {
	status: 'archived' | 'active';
	contactIDs: readonly string[];
}
