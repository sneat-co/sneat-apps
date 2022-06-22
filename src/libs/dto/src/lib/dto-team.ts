import { TeamType } from '@sneat/core';
import { IAssetBrief } from './dto-asset';
import { TeamCounts } from './dto-commune';
import { IContactBrief } from './dto-contact';
import { IHappeningBrief } from './dto-happening';
import { IListGroupsHolder } from './dto-list';
import { IMemberBrief } from './dto-member';
import { ITotalsHolder } from './dto-models';
import { IMeetingInfo } from './dto-team-meeting';
import { ITeamMetric } from './dto-team-metric';

export interface ITeamMeetings {
	scrum?: IMemberBrief;
	retrospective?: IMeetingInfo;
}

export interface ITeamDto extends ITotalsHolder, IListGroupsHolder {
	readonly type: TeamType;
	readonly title: string;
	readonly userIDs: string[];
	readonly memberIds?: string[];
	readonly members?: IMemberBrief[];
	readonly assets?: IAssetBrief[];
	readonly contacts?: IContactBrief[];
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
