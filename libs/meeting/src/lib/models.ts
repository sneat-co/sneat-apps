import { IMemberBrief } from '@sneat/extension-contactus-contract';
import { ITimerState } from './timer';

export type IMeetingMember = IMemberBrief;

export interface IMeeting {
  timer?: ITimerState;
  readonly userIDs: string[];
  readonly members?: IMeetingMember[];
}
