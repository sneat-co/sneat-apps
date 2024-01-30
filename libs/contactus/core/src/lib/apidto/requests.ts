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
import { ITeamRequest, TeamMemberStatus } from '@sneat/team-models';

export interface ICreateTeamMemberRequest extends ITeamRequest, IRelatedPerson {
	type: MemberContactType;
	status: TeamMemberStatus;
	countryID: string;
	roles: string[];
	// memberType: MemberType;
	message?: string;
}

export interface ICreateContactBaseRequest extends ITeamRequest {
	status: 'active' | 'draft';
	type: ContactType;
	// countryID: string;
	parentContactID?: string;
	roles?: string[];
	relatedToAssets?: IContact2Asset[];
	relatedToContacts?: Record<string, IContact2ContactInRequest>;
}

export interface ICreateContactPersonRequest extends ICreateContactBaseRequest {
	type: 'person';
	person?: ICreatePeronRequest;
}

export interface ICreateContactLocationRequest
	extends ICreateContactBaseRequest {
	type: 'location';
	location?: ICreateLocationRequest;
}

export interface IBasicContactRequest {
	// type: ContactType;
	// relationship?: string;
	// message?: string;
	title: string;
	// parentContactID?: string;
}

export interface ICreateContactBasicRequest extends ICreateContactBaseRequest {
	basic: IBasicContactRequest;
}

export interface ICreateLocationBaseRequest {
	title: string;
	address: IAddress;
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
	memberID?: string;
	userID?: string;
	title: string;
}

interface IInvite {
	message?: string;
}

export interface IInviteFromContact {
	memberID: string;
	userID?: string;
	title?: string;
}

export type InviteChannel = 'email' | 'sms' | 'link';

export interface IInviteToContact {
	channel: InviteChannel;
	address?: string;
	memberID?: string;
	title?: string;
}

export interface IPersonalInvite extends IInvite {
	team: { id: string; title: string };
	memberID: string;
	from: IInviteFromContact;
	to: IInviteToContact;
}

export interface IAddTeamMemberResponse {
	member: IMemberContext;
}

export interface IAcceptPersonalInviteRequest extends ITeamRequest {
	inviteID: string;
	pin: string; // Do not make number as we can lose leading 0's
	member?: IMemberBrief;
	// fullName?: string;
	// email?: string;
}

export interface ICreatePersonalInviteRequest extends ITeamRequest {
	to: IInviteToContact;
	message: string;
}
