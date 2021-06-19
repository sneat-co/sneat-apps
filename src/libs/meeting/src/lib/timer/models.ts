import firebase from 'firebase';
import Timestamp = firebase.firestore.Timestamp;
import {IMeetingRequest} from '@sneat/meeting';

// eslint-disable-next-line no-shadow
export enum TimerOperationEnum {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	start = 'start',
	// eslint-disable-next-line @typescript-eslint/naming-convention
	stop = 'stop',
	// eslint-disable-next-line @typescript-eslint/naming-convention
	pause = 'pause',
}

export type TimerOperation = TimerOperationEnum.start | TimerOperationEnum.stop | TimerOperationEnum.pause;

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
export type TimerStatus = TimerStatusEnum.active | TimerStatusEnum.stopped | TimerStatusEnum.paused;

export interface IByUser {
	uid: string
	title?: string;
}

export interface ITimerState {
	status?: TimerStatus;
	elapsedSeconds?: number;
	activeMemberId?: string;
	at?: Timestamp | string;
	by?: IByUser;
	secondsByMember?: { [member: string]: number };
	isToggling?: boolean;
}

export interface IMeetingTimerRequest extends IMeetingRequest{
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
