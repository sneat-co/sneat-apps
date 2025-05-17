import { SpaceType } from '@sneat/core';
import { ISpaceModuleItemRef } from '@sneat/dto';

export interface ISpaceRequest {
	readonly spaceID: string;
}

export interface ISpaceItemRequest extends ISpaceRequest {
	readonly id: string;
}

export interface ISpaceMemberRequest extends ISpaceRequest {
	readonly memberID: string;
}

export interface ILeaveSpaceRequest extends ISpaceRequest {
	readonly message?: string;
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

export type SpaceMemberStatus = 'active' | 'archived';

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

export interface IModuleCollectionRef {
	readonly moduleID: string;
	readonly collection: string;
}

export interface IRelatedRolesRequest {
	readonly rolesOfItem?: string[];
	readonly rolesToItem?: string[];
}

export interface IRelatedChange {
	readonly add?: IRelatedRolesRequest;
	readonly remove?: IRelatedRolesRequest;
}

export interface IRelatedItemChange extends IRelatedChange {
	readonly itemRef: ISpaceModuleItemRef;
}

export interface IUpdateRelatedRequest
	extends ISpaceItemRequest,
		IModuleCollectionRef {
	readonly related?: IRelatedItemChange[];
}
