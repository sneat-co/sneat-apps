import {
	AgeGroup,
	Gender,
	IContact2Asset,
	IMemberDto,
	IPerson,
	IRelatedPerson,
	MemberRole,
	MemberType,
} from '@sneat/dto';
import { IMemberContext } from './team-context';


export interface ITeamRequest {
	readonly teamID: string;
}

export interface ITeamMemberRequest extends ITeamRequest {
	member: string;
}

export interface IAcceptPersonalInviteRequest extends ITeamRequest {
	inviteID: string;
	pin: string; // Do not make number as we can lose leading 0's
	fullName?: string;
	email?: string;
}

export interface IRejectPersonalInviteRequest extends ITeamRequest {
	invite: string;
	pin: string;
}


export interface ICreateTeamMemberRequest extends ITeamRequest, IRelatedPerson {
	memberType: MemberType;
	message?: string;
}

export interface ICreateContactRequest extends ITeamRequest, IRelatedPerson {
	// message?: string;
	assetIDs?: IContact2Asset[];
}

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
	title?: string
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

export interface ITaskRequest extends ITeamMemberRequest {
	type: string;
	task: string;
}

export interface IReorderTaskRequest extends ITaskRequest {
	len: number;
	from: number;
	to: number;
	after?: string;
	before?: string;
}
