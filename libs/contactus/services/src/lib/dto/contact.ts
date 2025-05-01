import { IPersonNames } from '@sneat/auth-models';
import { AgeGroupID, Gender } from '@sneat/contactus-core';
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
	readonly gender?: Gender;
	readonly names?: IPersonNames;
	readonly vatNumber?: string;
}

export function validateUpdateContactRequest(
	request: IUpdateContactRequest,
): void {
	validateContactRequest(request);
	if (
		!request.address &&
		!request.ageGroup &&
		!request.gender &&
		!request.names &&
		!request.vatNumber
	) {
		throw new Error(
			'At least one of the following is required: address, ageGroup, gender, names',
		);
	}
}

export interface ISetContactsStatusRequest extends SpaceRequest {
	status: 'archived' | 'active';
	contactIDs: readonly string[];
}

export function validateSetContactsRequest(
	request: ISetContactsStatusRequest,
): void {
	if (!request.spaceID) {
		throw new Error('spaceID parameters is required');
	}
	if (!request.contactIDs.length) {
		throw new Error('contactIDs is required parameter');
	}
}
