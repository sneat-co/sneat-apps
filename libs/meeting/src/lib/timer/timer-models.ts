import { IByUser } from '@sneat/dto';
import { IMeetingRequest } from '../meeting-request';

// Lightweight stand-in for Firebase Timestamp to avoid pulling in Firebase at build/test time.
// At runtime the value is either a Firestore Timestamp object or an ISO string.
interface FirebaseTimestamp {
  readonly seconds: number;
  readonly nanoseconds: number;
  toDate(): Date;
  toMillis(): number;
}

export enum TimerOperationEnum {
  start = 'start',

  stop = 'stop',

  pause = 'pause',
}

export type TimerOperation =
  | TimerOperationEnum.start
  | TimerOperationEnum.stop
  | TimerOperationEnum.pause;

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

export interface ITimerState {
  status?: TimerStatus;
  elapsedSeconds?: number;
  activeMemberId?: string;
  at?: FirebaseTimestamp | string;
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
