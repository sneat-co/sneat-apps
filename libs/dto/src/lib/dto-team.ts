import { TeamType } from '@sneat/core';
import { TeamCounts } from './dto-commune';
import { ITotalsHolder } from './dto-models';
import { ITeamMetric } from './dto-team-metric';

// export interface ITeamMeetings {
// 	scrum?: IMemberBrief;
// 	retrospective?: IMeetingInfo;
// }

export interface ITeamDto extends ITotalsHolder {
	readonly type: TeamType;
	readonly countryID: string;
	readonly title: string;
	readonly userIDs: string[];
	// readonly members?: IMemberBrief[];
	// readonly assets?: IAssetBrief[];
	// readonly contacts?: IContactBrief[];
	readonly numberOf?: TeamCounts;
	// readonly recurringHappenings?: { [id: string]: IHappeningBrief }; // TODO: Move to ISchedulusTeamDto

	metrics: ITeamMetric[];
	// active?: ITeamMeetings;
	// last?: ITeamMeetings;
	upcomingRetro?: {
		itemsByUserAndType?: { [user: string]: { [itemType: string]: number } };
	};

	noContactRoles?: string[]; // lists roles that have no contacts. For example families that have no plumber contacts.
}
