import { IByUser } from '@sneat/dto';
import { IMeetingRequest } from '../models';
import { Timestamp } from '@firebase/firestore-types';

// eslint-disable-next-line no-shadow
export enum TimerOperationEnum {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	start = 'start',
	// eslint-disable-next-line @typescript-eslint/naming-convention
	stop = 'stop',
	// eslint-disable-next-line @typescript-eslint/naming-convention
	pause = 'pause',
}

export type TimerOperation =
	| TimerOperationEnum.start
	| TimerOperationEnum.stop
	| TimerOperationEnum.pause;

// eslint-disable-next-line no-shadow
export enum TimerStatusEnum {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	active = 'active',
	// eslint-disable-next-line @typescript-eslint/naming-convention
	stopped = 'stopped',
	// eslint-disable-next-line @typescript-eslint/naming-convention
	paused = 'paused',
}

// TODO(StackOverflow): does it make sense to have both `type` && `enum`?
export type TimerStatus =
	| TimerStatusEnum.active
	| TimerStatusEnum.stopped
	| TimerStatusEnum.paused;

export interface ITimerState {
	status?: TimerStatus;
	elapsedSeconds?: number;
	activeMemberId?: string;
	at?: Timestamp | string;
	by?: IByUser;
	secondsByMember?: Record<string, number>;
	isToggling?: boolean;
}

export interface IMeetingTimerRequest extends IMeetingRequest {
	spaceID: string; // TODO: remove temporary workaround, should come from: IMeetingRequest < ITeamRequest
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
