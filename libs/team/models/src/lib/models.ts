import { SpaceType } from '@sneat/core';

export interface ISpaceRequest {
	readonly spaceID: string;
}

export interface ISpaceMemberRequest extends ISpaceRequest {
	readonly memberID: string;
}

export interface IAcceptInviteResponse {
	readonly id: string;
}

export interface IInviteSpace {
	readonly id: string;
	readonly type: SpaceType;
	readonly title: string;
}

export interface IRejectPersonalInviteRequest extends ISpaceRequest {
	readonly inviteID: string;
	readonly pin: string;
}

export type TeamMemberStatus = 'active' | 'archived';

export interface ITaskRequest extends ISpaceMemberRequest {
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
