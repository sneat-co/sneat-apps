import { IMemberBrief } from '@sneat/contactus-core';
import { ISpaceRequest } from '@sneat/team-models';
import { ITimerState } from './timer';

export interface IMeetingRequest extends ISpaceRequest {
	meeting: string;
}

export type IMeetingMember = IMemberBrief;

export interface IMeeting {
	timer?: ITimerState;
	readonly userIDs: string[];
	readonly members?: IMeetingMember[];
}
