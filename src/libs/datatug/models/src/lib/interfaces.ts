import {MemberRole, TimerStatus} from './dto-models';
import {Timestamp} from '@firebase/firestore';

// import {Timestamp} from 'firebase/firestore';

export type RecordState = 'creating' | 'changed' | 'updating' | 'deleting';

export interface IRecord<T> {
  id: string;
  state?: RecordState;
  data?: T;
}

export interface IUserTeamInfo {
  title: string;
  retroItems?: { [type: string]: IRetroItem[] };
}

export interface IUserTeamInfoWithId extends IUserTeamInfo {
  id: string;
}

export interface IDataTugUser {
  title: string;
  email?: string;
  emailVerified?: boolean;
  avatar?: IAvatar;
  teams?: { [id: string]: IUserTeamInfo };
  dataTug?: IDataTugBriefForUser;
  dataTugProjects?: IDataTugProjectBrief[];
}

export interface IDataTugBriefForUser {
  stores:  IDataTugStoreBrief[];
  projects: IDataTugProjectBrief[];
}

export interface IDataTugStoreBrief {
  title: string;
  type: DataTugProjStoreType;
  url: string;
}

export type DataTugProjStoreType = 'agent' | 'local' | 'github';

export interface IDataTugProjStoreBrief {
  type: DataTugProjStoreType;
  url?: string;
}

export interface IDataTugProjectBrief {
  readonly id: string;
  readonly store: IDataTugProjStoreBrief;
  readonly title?: string;
  readonly titleOverride?: string;
}

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

export interface IAvatar {
  gravatar?: string;
  external?: {
    provider?: string;
    url?: string;
  };
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

export type TaskType = 'done' | 'risk' | 'todo' | 'plan' | 'qna' | 'kudos';

interface Modified {
  by: string;
  on: string;
}

export interface ITask {
  id: string;
  title: string;
  by?: IBy;
  progress?: number;
  added?: Modified;
  thumbUps?: string[];
  lastModified?: Modified;
  comments?: ITaskComment[];
}

interface IQuestion extends ITask {
  isAnswered?: boolean;
  isAnswerAccepted?: boolean;
}

export interface IBy {
  memberId?: string;
  userId?: string;
  title: string;
}

export interface ITaskComment {
  id: string;
  by: IBy;
  message: string;
}

export interface IScrumStatusMember {
  id: string;
  roles?: MemberRole[];
  title: string;
  avatar?: IAvatar;
}

export interface IStatus {
  member: IScrumStatusMember;
  byType: {
    plan?: ITask[]; // For now for UI only
    done?: ITask[];
    todo?: ITask[];
    risk?: ITask[];
    qna?: IQuestion[];
    kudos?: ITask[];
  }; // TODO: consider mapped object type
}


export interface IByUser {
  uid: string
  title?: string;
}

export type IMeetingMember = IMemberInfo;

export interface IMeeting {
  timer?: ITimerState;
  readonly userIds: string[];
  readonly members?: IMeetingMember[];
}

export interface IScrum extends IMeeting {  // Key as: YYYY-MM-DD
  scrumIds?: {
    prev?: string; // 'YYYY-MM-DD'
    next?: string; // 'YYYY-MM-DD'
  };
  readonly risksCount?: number;
  readonly questionsCount?: number;
  statuses: IStatus[];
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

interface IInvite {
  message?: string;
}

interface IPerson {
  title: string;
  email: string;
}

export interface IPersonalInvite extends IInvite {
  channel: string;
  address: string;
  team: { id: string; title: string };
  memberId: string;
  from: IPerson;
  to: IPerson;
}

export interface IRetroItem {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  ID: string; // see comments on RetroItem in Go why it's not `id` in all lower case
  type?: string; // provided only for root level items
  title: string;
  children?: IRetroItem[];
  likedUserIds?: string[];
}

export interface IRetroListItem extends IRetroItem {
  isDeleting?: boolean;
}

export interface IRetroList {
  id: string;
  title: string;
  items?: IRetroListItem[];
}

// export interface IRetroListsByType {
// 	[type: string]: IRetroList[];
// }

// eslint-disable-next-line no-shadow
export enum RetrospectiveStage {
  upcoming = 'upcoming',
  feedback = 'feedback',
  review = 'review',
}

export interface IRetrospective extends IMeeting {
  stage: RetrospectiveStage;
  timeStarts?: string; // datetime
  timeStarted?: string; // datetime
  timeFinished?: string; // datetime
  plannedDuraitonInMinutes?: number;
  lists?: IRetroList[];
}
