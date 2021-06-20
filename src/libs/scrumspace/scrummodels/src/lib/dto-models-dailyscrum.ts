import {IByUser, ITimerState} from '@sneat/timer';
import {IRecord} from '@sneat/data';
import {ITeam} from '@sneat/team-models';

export interface ITeamRequest {
	team: string;
}

export interface ITeamMemberRequest extends ITeamRequest {
	member: string;
}

// TODO(help-wanted): Why ESLint gives "no-shadow" error: 'MemberRoleEnum' is already declared in the upper scope
// https://github.com/sneat-team/sneat-team-pwa/issues/380
// eslint-disable-next-line no-shadow
export enum MemberRoleEnum {
	contributor = 'contributor',
	spectator = 'spectator',
}

export type MemberRole = MemberRoleEnum.contributor | MemberRoleEnum.spectator;

export interface IAddTeamMemberRequest extends ITeamRequest {
	role: MemberRole;
	title: string;
	email?: string;
	message?: string;
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
	start = 'start',
	stop = 'stop',
	pause = 'pause',
}

export type TimerOperation = TimerOperationEnum.start | TimerOperationEnum.stop | TimerOperationEnum.pause;

// eslint-disable-next-line no-shadow
export enum TimerStatusEnum {
	active = 'active',
	stopped = 'stopped',
	paused = 'paused',
}

// TODO(StackOverflow): does it make sense to have both `type` && `enum`?
export type TimerStatus = TimerStatusEnum.active | TimerStatusEnum.stopped | TimerStatusEnum.paused;


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

export interface IThumbUpRequest extends ITaskRequest {
	value: boolean;
}

export interface IAddCommentRequest extends ITaskRequest {
	message: string;
}

export interface IAddTaskRequest extends ITaskRequest {
	title: string;
}

export interface ICreateTeamRequest {
	title: string;
}

export interface ICreateTeamResponse {
	team: IRecord<ITeam>;
}
