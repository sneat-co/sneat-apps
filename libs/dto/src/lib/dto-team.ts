import { SpaceType } from '@sneat/core';
import { ITotalsHolder } from './dto-models';
import { ISpaceMetric } from './dto-team-metric';

// export interface ITeamMeetings {
// 	scrum?: IMemberBrief;
// 	retrospective?: IMeetingInfo;
// }

export interface ISpaceDbo extends ITotalsHolder {
	readonly type: SpaceType;
	readonly countryID: string;
	readonly title: string;
	readonly userIDs: string[];
	// readonly members?: IMemberBrief[];
	// readonly assets?: IAssetBrief[];
	// readonly contacts?: IContactBrief[];
	// readonly numberOf?: TeamCounts;
	// readonly recurringHappenings?: { [id: string]: IHappeningBrief }; // TODO: Move to ISchedulusTeamDto

	metrics: ISpaceMetric[];
	// active?: ITeamMeetings;
	// last?: ITeamMeetings;
	upcomingRetro?: {
		itemsByUserAndType?: Record<string, Record<string, number>>;
	};

	noContactRoles?: string[]; // lists roles that have no contacts. For example families that have no plumber contacts.
}
