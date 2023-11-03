import { TeamType } from '@sneat/core';

export interface ITeamRequest {
	readonly teamID: string;
}

export interface ITeamMemberRequest extends ITeamRequest {
	memberID: string;
}

export interface IAcceptInviteResponse {
	id: string;
}

export interface IInviteTeam {
	id: string;
	type: TeamType;
	title: string;
}

export interface IRejectPersonalInviteRequest extends ITeamRequest {
	inviteID: string;
	pin: string;
}

export type TeamMemberStatus = 'active' | 'archived';

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
