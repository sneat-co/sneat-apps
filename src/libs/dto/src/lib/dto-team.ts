import { IBriefWithIdAndTitle } from './dto-brief';
import { TeamCounts } from './dto-commune';
import { IMemberBrief } from './dto-member';
import { ITotalsHolder } from './dto-models';
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

export const equalTeamBriefs = (v1?: ITeamBrief | null, v2?: ITeamBrief | null): boolean => {
	if (v1 === v2)
		return true;
	if (v1?.id === v2?.id && v1?.type === v2?.type && v1?.parentTeamID === v2?.parentTeamID && v1?.title === v2?.title)
		return true;
	return false;
};

export interface ITeamDto extends ITotalsHolder {
	readonly type: TeamType;
	readonly title: string;
	readonly userIDs: string[];
	readonly memberIds?: string[];
	readonly members: IMemberBrief[];
	readonly numberOf?: TeamCounts;

	metrics: ITeamMetric[];
	active?: ITeamMeetings;
	last?: ITeamMeetings;
	upcomingRetro?: {
		itemsByUserAndType?: { [user: string]: { [itemType: string]: number } };
	};

	noContactRoles?: string[]; // lists roles that have no contacts. For example families that have no plumber contacts.
}
