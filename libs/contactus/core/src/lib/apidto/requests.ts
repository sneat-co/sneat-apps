import { mustHaveAtLeastOneName } from '@sneat/auth-models';
import { validateRelated } from '@sneat/dto';
import {
	ContactType,
	IAddress,
	IContact2Asset,
	IContact2ContactInRequest,
	ICreatePeronRequest,
	IMemberBrief,
	IRelatedPerson,
	MemberContactType,
} from '../dto';
import { IMemberContext } from '../contexts';
import { SpaceRequest, SpaceMemberStatus } from '@sneat/space-models';

export interface ICreateSpaceMemberRequest
	extends SpaceRequest,
		IRelatedPerson {
	readonly type: MemberContactType;
	readonly status: SpaceMemberStatus;
	readonly countryID: string;
	readonly roles: readonly string[];
	readonly message?: string;
}

export function validateCreateSpaceMemberRequest(
	request: ICreateSpaceMemberRequest,
): void {
	mustHaveAtLeastOneName(request.names);
	validateRelated(request.related);
}

export interface ICreateContactBaseRequest extends SpaceRequest {
	readonly status: 'active' | 'draft';
	readonly type: ContactType;
	// countryID: string;
	readonly parentContactID?: string;
	readonly roles?: readonly string[];
	readonly relatedToAssets?: readonly IContact2Asset[];
	readonly relatedToContacts?: Readonly<
		Record<string, IContact2ContactInRequest>
	>;
}

export interface ICreateContactPersonRequest extends ICreateContactBaseRequest {
	readonly type: 'person';
	readonly person?: ICreatePeronRequest;
}

export interface ICreateContactLocationRequest
	extends ICreateContactBaseRequest {
	readonly type: 'location';
	readonly location?: ICreateLocationRequest;
}

export interface IBasicContactRequest {
	// type: ContactType;
	// relationship?: string;
	// message?: string;
	readonly title: string;
	// parentContactID?: string;
}

export interface ICreateContactBasicRequest extends ICreateContactBaseRequest {
	readonly basic: IBasicContactRequest;
}

export interface ICreateLocationBaseRequest {
	readonly title: string;
	readonly address: IAddress;
}

export type ICreateLocationRequest = ICreateLocationBaseRequest;
export type ICreateCompanyRequest = ICreateLocationBaseRequest;

export interface ICreateContactCompanyRequest
	extends ICreateContactBaseRequest {
	company?: ICreateCompanyRequest;
}

export type ICreateContactRequest =
	| ICreateContactPersonRequest
	| ICreateContactCompanyRequest
	| ICreateContactLocationRequest
	| ICreateContactBasicRequest;

export interface IBy {
	readonly memberID?: string;
	readonly userID?: string;
	readonly title: string;
}

interface IInvite {
	readonly message?: string;
}

export interface IInviteFromContact {
	readonly memberID: string;
	readonly userID?: string;
	readonly title?: string;
}

export type InviteChannel = 'email' | 'sms' | 'link';

export interface IInviteToContact {
	readonly channel: InviteChannel;
	readonly address?: string;
	readonly memberID?: string;
	readonly title?: string;
}

export interface IPersonalInvite extends IInvite {
	readonly space: { readonly id: string; readonly title: string };
	readonly memberID: string;
	readonly from: IInviteFromContact;
	readonly to: IInviteToContact;
}

export interface IAddSpaceMemberResponse {
	readonly member: IMemberContext;
}

export interface IAcceptPersonalInviteRequest extends SpaceRequest {
	readonly inviteID: string;
	readonly pin: string; // Do not make number as we can lose leading 0's
	readonly member?: IMemberBrief;
	// fullName?: string;
	// email?: string;
}

export interface ICreatePersonalInviteRequest extends SpaceRequest {
	readonly to: IInviteToContact;
	readonly message: string;
}
