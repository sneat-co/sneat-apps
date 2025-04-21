import { AgeGroupID, Gender, IRelatedItemChange } from '@sneat/contactus-core';
import { IAddress } from '@sneat/contactus-core';
import { SpaceRequest } from '@sneat/space-models';

export interface IContactRequest extends SpaceRequest {
	readonly contactID: string;
}

export function validateContactRequest(request: IContactRequest): void {
	if (!request.spaceID) {
		throw new Error('spaceID parameters is required');
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
	readonly related?: IRelatedItemChange[];
	readonly gender?: Gender;
}

export interface ISetContactRolesRequest {
	readonly add?: readonly string[];
	readonly remove?: readonly string[];
}

export interface ISetContactsStatusRequest extends SpaceRequest {
	status: 'archived' | 'active';
	contactIDs: readonly string[];
}
