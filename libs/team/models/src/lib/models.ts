import { TeamType } from '@sneat/core';

export interface ITeamRequest {
	readonly teamID: string;
}

export interface ITeamMemberRequest extends ITeamRequest {
	readonly memberID: string;
}

export interface IAcceptInviteResponse {
	readonly id: string;
}

export interface IInviteTeam {
	readonly id: string;
	readonly type: TeamType;
	readonly title: string;
}

export interface IRejectPersonalInviteRequest extends ITeamRequest {
	readonly inviteID: string;
	readonly pin: string;
}

export type TeamMemberStatus = 'active' | 'archived';

export interface ITaskRequest extends ITeamMemberRequest {
	readonly type: string;
	readonly task: string;
}

export interface IReorderTaskRequest extends ITaskRequest {
	readonly len: number;
	readonly from: number;
	readonly to: number;
	readonly after?: string;
	readonly before?: string;
}
