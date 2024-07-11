import { AgeGroupID, IRelatedToRequest } from '@sneat/contactus-core';
import { IAddress } from '@sneat/contactus-core';
import { SpaceRequest } from '@sneat/team-models';

export interface IContactRequest extends SpaceRequest {
	readonly contactID: string;
}

export function validateContactRequest(request: IContactRequest): void {
	if (!request.spaceID) {
		throw new Error('teamID parameters is required');
	}
	if (!request.contactID) {
		throw new Error('contactID is required parameter');
	}
}

export interface IContactRequestWithOptionalMessage extends IContactRequest {
	readonly message?: string;
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

export interface ISetContactsStatusRequest extends SpaceRequest {
	status: 'archived' | 'active';
	contactIDs: readonly string[];
}
