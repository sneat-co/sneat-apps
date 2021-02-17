import {IByUser, ITimerState} from './interfaces';

export interface ITeamRequest {
	team: string;
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

// eslint-disable-next-line no-shadow
export enum MemberRoleEnum {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	Contributor = 'contributor',
	// eslint-disable-next-line @typescript-eslint/naming-convention
	Spectator = 'spectator',
}

export type MemberRole = MemberRoleEnum.Contributor | MemberRoleEnum.Spectator;

export interface IAddTeamMemberRequest extends ITeamRequest {
	role: MemberRole;
	title: string;
	email?: string;
	message?: string;
}

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

export interface IMeetingRequest extends ITeamRequest {
	meeting: string;
}

export interface ITaskRequest extends ITeamMemberRequest, IMeetingRequest {
	type: string;
	task: string;
}

// eslint-disable-next-line no-shadow
export enum TimerOperationEnum {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	Start = 'start',
	// eslint-disable-next-line @typescript-eslint/naming-convention
	Stop = 'stop',
	// eslint-disable-next-line @typescript-eslint/naming-convention
	Pause = 'pause',
}

export type TimerOperation = TimerOperationEnum.Start | TimerOperationEnum.Stop | TimerOperationEnum.Pause;

// eslint-disable-next-line no-shadow
export enum TimerStatusEnum {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	Active = 'active',
	// eslint-disable-next-line @typescript-eslint/naming-convention
	Stopped = 'stopped',
	// eslint-disable-next-line @typescript-eslint/naming-convention
	Paused = 'paused',
}

// TODO(StackOverflow): does it make sense to have both `type` && `enum`?
export type TimerStatus = TimerStatusEnum.Active | TimerStatusEnum.Stopped | TimerStatusEnum.Paused;


export interface IMeetingTimerRequest extends IMeetingRequest {
	operation: TimerOperation;
}

export interface IMemberTimerRequest extends IMeetingTimerRequest {
	member: string;
}

export interface ITimestamp {
	timer: ITimerState;
}

export interface ITimerResponse extends ITimestamp {
	by: IByUser;
}


export interface IReorderTaskRequest extends ITaskRequest {
	len: number;
	from: number;
	to: number;
	after?: string;
	before?: string;
}
