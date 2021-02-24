import {IMemberInfo, ITeamRequest} from '@sneat/team';
import {ITimerState} from '@sneat/timer';
import {IStatus} from '@sneat/scrumspace/dailyscrum';

export interface IMeetingRequest extends ITeamRequest {
  meeting: string;
}

export type IMeetingMember = IMemberInfo;

export interface IMeeting {
  timer?: ITimerState;
  readonly userIds: string[];
  readonly members?: IMeetingMember[];
}

