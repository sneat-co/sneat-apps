import { AgeGroup, Gender, IMemberDto, IPerson, MemberRole, MemberType } from '@sneat/dto';


export interface ITeamRequest {
	readonly teamID: string;
}

export interface ITeamMemberRequest extends ITeamRequest {
	member: string;
}

export interface IAcceptPersonalInviteRequest extends ITeamRequest {
	invite: string;
	pin: string;
	fullName: string;
	email: string;
}

export interface IRejectPersonalInviteRequest extends ITeamRequest {
	invite: string;
	pin: string;
}


export interface ICreateTeamMemberRequest extends ITeamRequest, IPerson {
	role: MemberRole;
	memberType: MemberType;
	message?: string;
}

export interface IBy {
	memberID?: string;
	userID?: string;
	title: string;
}


interface IInvite {
	message?: string;
}

interface IPersonWithEmail {
	title: string;
	email: string;
}

export interface IPersonalInvite extends IInvite {
	channel: string;
	address: string;
	team: { id: string; title: string };
	memberID: string;
	from: IPersonWithEmail;
	to: IPersonWithEmail;
}

export interface IAddTeamMemberResponse {
	id: string;
	dto: IMemberDto;
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
