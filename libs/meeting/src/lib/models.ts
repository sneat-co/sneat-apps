import { IMemberBrief } from '@sneat/dto';
import { ITeamRequest } from '@sneat/team/models';
import { ITimerState } from './timer/models';

export interface IMeetingRequest extends ITeamRequest {
	meeting: string;
}

export type IMeetingMember = IMemberBrief;

export interface IMeeting {
	timer?: ITimerState;
	readonly userIDs: string[];
	readonly members?: IMeetingMember[];
}
