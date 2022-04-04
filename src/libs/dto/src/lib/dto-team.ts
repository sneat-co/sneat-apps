import { IAssetBrief } from './dto-asset';
import { IBriefWithIdAndTitle } from './dto-brief';
import { TeamCounts } from './dto-commune';
import { IMemberBrief } from './dto-member';
import { IMeetingInfo } from './dto-team-meeting';
import { ITeamMetric } from './dto-team-metric';
import { TeamType } from './types';

export interface ITeamMeetings {
	scrum?: IMemberBrief;
	retrospective?: IMeetingInfo;
}

export interface ITeamBrief extends IBriefWithIdAndTitle {
	readonly type: TeamType;
	readonly parentTeamID?: string;
	readonly roles?: string[];
}

export interface ITeamDto {
	readonly type: TeamType;
	readonly title: string;
	readonly userIDs: string[];
	readonly memberIds?: string[];
	readonly members: IMemberBrief[];
	readonly assets?: IAssetBrief[];
	readonly numberOf?: TeamCounts;
	metrics: ITeamMetric[];
	active?: ITeamMeetings;
	last?: ITeamMeetings;
	upcomingRetro?: {
		itemsByUserAndType?: { [user: string]: { [itemType: string]: number } };
	};

	noContactRoles?: string[]; // lists roles that have no contacts. For example families that have no plumber contacts.
}
