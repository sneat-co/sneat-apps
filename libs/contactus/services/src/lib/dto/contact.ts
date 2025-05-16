import { IPersonNames } from '@sneat/auth-models';
import {
	AgeGroupID,
	ContactCommChannelType,
	Gender,
} from '@sneat/contactus-core';
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
	readonly dateOfBirth?: string;
}

export function validateUpdateContactRequest(
	request: IUpdateContactRequest,
): void {
	validateContactRequest(request);
	if (
		!request.address &&
		!request.names &&
		request.ageGroup === undefined &&
		request.gender === undefined &&
		request.vatNumber === undefined &&
		request.dateOfBirth === undefined
	) {
		throw new Error(
			'At least one of the following is required: address, ageGroup, gender, dateOfBirth, names',
		);
	}
}

export interface ISetContactsStatusRequest extends SpaceRequest {
	readonly status: 'archived' | 'active';
	readonly contactIDs: readonly string[];
}

export interface IContactCommChannelRequest extends IContactRequest {
	readonly channelType: ContactCommChannelType;
	readonly channelID: string;
}

export interface IUpdateContactCommChannelTypeRequest
	extends IContactCommChannelRequest {
	readonly title: 'private' | 'work' | string;
}

export interface IAddContactCommChannelRequest
	extends IContactCommChannelRequest {
	readonly type: 'private' | 'work';
	readonly note?: string;
}

export interface IUpdateContactCommChannelRequest
	extends IContactCommChannelRequest {
	readonly newChannelID?: string;
	readonly type?: 'private' | 'work';
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
