import { IAvatar } from '@sneat/auth-models';
import { AgeGroup, Gender, TeamType } from '@sneat/dto';

export type MetricColor =
	| 'primary'
	| 'secondary'
	| 'tertiary'
	| 'success'
	| 'danger'
	| 'warning';

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
	gender: Gender;
	ageGroup?: AgeGroup;
	email?: string;
	phone?: string;
	message?: string;
}

export interface ITeamDto {
	readonly type: TeamType;
	readonly title: string;
	readonly userIds: string[];
	readonly memberIds?: string[];
	readonly members: IMemberInfo[];
	metrics: ITeamMetric[];
	active?: ITeamMeetings;
	last?: ITeamMeetings;
	upcomingRetro?: {
		itemsByUserAndType?: { [user: string]: { [itemType: string]: number } };
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

// Obsolete - replaced with IMemberDto
export interface IMember {
	gender?: 'male' | 'female';
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

export interface IAddTeamMemberResponse {
	id: string;
	uid?: string;
}

export interface ITaskRequest extends ITeamMemberRequest {
	type: string;
	task: string;
}

export interface IReorderTaskRequest extends ITaskRequest {
	len: number;
	from: number;
	to: number;
	after?: string;
	before?: string;
}
