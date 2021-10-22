// eslint-disable-next-line no-shadow
import { ITaskRequest } from '@sneat/team-models';
import { IByUser, IMeetingRequest, ITimerState } from '@sneat/meeting';

export enum TimerOperationEnum {
	start = 'start',
	stop = 'stop',
	pause = 'pause',
}

export type TimerOperation =
	| TimerOperationEnum.start
	| TimerOperationEnum.stop
	| TimerOperationEnum.pause;

// eslint-disable-next-line no-shadow
export enum TimerStatusEnum {
	active = 'active',
	stopped = 'stopped',
	paused = 'paused',
}

// TODO(StackOverflow): does it make sense to have both `type` && `enum`?
export type TimerStatus =
	| TimerStatusEnum.active
	| TimerStatusEnum.stopped
	| TimerStatusEnum.paused;

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
