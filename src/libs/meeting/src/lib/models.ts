import {IMemberInfo, ITeamRequest} from '@sneat/team-models';
import {ITimerState} from './timer/models';

export interface IMeetingRequest extends ITeamRequest {
	meeting: string;
}

export type IMeetingMember = IMemberInfo;

export interface IMeeting {
	timer?: ITimerState;
	readonly userIds: string[];
	readonly members?: IMeetingMember[];
}

