import { AgeGroup, Gender, MemberRole } from '@sneat/dto';


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


export interface IAddTeamMemberRequest extends ITeamRequest {
	role: MemberRole;
	title: string;
	gender: Gender;
	ageGroup?: AgeGroup;
	email?: string;
	phone?: string;
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

interface IPerson {
	title: string;
	email: string;
}

export interface IPersonalInvite extends IInvite {
	channel: string;
	address: string;
	team: { id: string; title: string };
	memberID: string;
	from: IPerson;
	to: IPerson;
}

export interface IAddTeamMemberResponse {
	id: string;
	uid?: string;
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
