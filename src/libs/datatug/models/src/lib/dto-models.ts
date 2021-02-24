import {ITeamMemberRequest} from '@sneat/team';
import {IMeetingRequest} from '@sneat/meeting';



export interface IApiError {
	code?: string;
	message: string;
}

export interface IErrorResponse {
	error: IApiError;
}

export interface IFieldError extends IApiError {
	field: string;
}

export interface IAddTeamMemberResponse {
	id: string;
	uid?: string;
}

export interface ITaskRequest extends ITeamMemberRequest, IMeetingRequest {
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
