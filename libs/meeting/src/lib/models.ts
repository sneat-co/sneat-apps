import { IMemberBrief } from '@sneat/contactus-core';
import { SpaceRequest } from '@sneat/team-models';
import { ITimerState } from './timer';

export interface IMeetingRequest extends SpaceRequest {
	meeting: string;
}

export type IMeetingMember = IMemberBrief;

export interface IMeeting {
	timer?: ITimerState;
	readonly userIDs: string[];
	readonly members?: IMeetingMember[];
}
