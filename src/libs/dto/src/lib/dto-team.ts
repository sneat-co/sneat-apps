import { IAssetBrief } from './dto-asset';
import { IBrief } from './dto-brief';
import { IMemberBrief } from './dto-member';
import { IMeetingInfo } from './dto-team-meeting';
import { ITeamMetric } from './dto-team-metric';
import { TeamType } from './types';

export interface ITeamMeetings {
	scrum?: IMemberBrief;
	retrospective?: IMeetingInfo;
}

export interface ITeamBrief extends IBrief {
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
	metrics: ITeamMetric[];
	active?: ITeamMeetings;
	last?: ITeamMeetings;
	upcomingRetro?: {
		itemsByUserAndType?: { [user: string]: { [itemType: string]: number } };
	};
}
