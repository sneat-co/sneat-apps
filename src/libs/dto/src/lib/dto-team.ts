import { TeamCounts } from './dto-commune';
import { IHappeningBrief } from './dto-happening';
import { IListGroupsHolder } from './dto-list';
import { IMemberBrief } from './dto-member';
import { ITotalsHolder } from './dto-models';
import { IMeetingInfo } from './dto-team-meeting';
import { ITeamMetric } from './dto-team-metric';
import { TeamType } from './types';

export interface ITeamMeetings {
	scrum?: IMemberBrief;
	retrospective?: IMeetingInfo;
}

export interface ITeamDto extends ITotalsHolder, IListGroupsHolder {
	readonly type: TeamType;
	readonly title: string;
	readonly userIDs: string[];
	readonly memberIds?: string[];
	readonly members: IMemberBrief[];
	readonly numberOf?: TeamCounts;
	readonly recurringHappenings: IHappeningBrief[];

	metrics: ITeamMetric[];
	active?: ITeamMeetings;
	last?: ITeamMeetings;
	upcomingRetro?: {
		itemsByUserAndType?: { [user: string]: { [itemType: string]: number } };
	};

	noContactRoles?: string[]; // lists roles that have no contacts. For example families that have no plumber contacts.
}
