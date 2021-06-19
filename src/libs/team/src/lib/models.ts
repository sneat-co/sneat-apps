import {IAvatar} from '@sneat/auth-models';

export type MetricColor = 'primary' | 'secondary' | 'tertiary' | 'success' | 'danger' | 'warning';

export interface IBoolMetricVal {
	label: string;
	color: MetricColor;
}

export interface IBoolMetric {
	true: IBoolMetricVal;
	false: IBoolMetricVal;
}

export interface ITeamMetric {
  id?: string;
  title: string;
  colorTrue?: MetricColor;
  colorFalse?: MetricColor;
  type: 'bool' | 'integer' | 'options';
  mode: 'personal' | 'team';
  bool?: IBoolMetric;
  min?: number;
  max?: number;
}

export interface ITeamRequest {
  team: string;
}

export interface ITeamMemberRequest extends ITeamRequest {
  member: string;
}

export interface IAcceptPersonalInviteRequest extends ITeamRequest {
  invite: string;
  pin: string;
  fullName: string;
  email: string;
}

export interface IRejectPersonalInviteRequest extends ITeamRequest {
  invite: string;
  pin: string;
}

// eslint-disable-next-line no-shadow
export enum MemberRoleEnum {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  contributor = 'contributor',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  spectator = 'spectator',
}

export type MemberRole = MemberRoleEnum.contributor | MemberRoleEnum.spectator;

export interface IAddTeamMemberRequest extends ITeamRequest {
  role: MemberRole;
  title: string;
  email?: string;
  message?: string;
}

export interface ITeam {
  title: string;
  userIds: string[];
  memberIds?: string[];
  members: IMemberInfo[];
  metrics: ITeamMetric[];
  active?: ITeamMeetings;
  last?: ITeamMeetings;
  upcomingRetro?: { itemsByUserAndType?: { [user: string]: { [itemType: string]: number } } };
}

export interface IMemberInfo {
  id: string;
  role?: MemberRole;
  roles: MemberRole[];
  email?: string;
  uid?: string;
  title: string;
  avatar?: IAvatar;
}

export interface IMember {
  title: string;
  roles: MemberRole[];
  email?: string;
  userId?: string;
  avatar?: IAvatar;
}


export interface IBy {
  memberId?: string;
  userId?: string;
  title: string;
}

export interface IMeetingInfo {
  id: string;
  stage: string;
  started?: string;
  finished?: string;
}

export interface ITeamMeetings {
  scrum?: IMemberInfo;
  retrospective?: IMeetingInfo;
}
