import { IMemberBrief } from '@sneat/contactus-core';
import { ITimerState } from './timer';

export type IMeetingMember = IMemberBrief;

export interface IMeeting {
	timer?: ITimerState;
	readonly userIDs: string[];
	readonly members?: IMeetingMember[];
}
