import { IMeeting } from '@sneat/ext-meeting';

export enum RetroItemTypeEnum {
	good = 'good',
	bad = 'bad',
	endorsement = 'endorsement',
	idea = 'idea',
}

export type RetroItemType =
	| string
	| RetroItemTypeEnum.good
	| RetroItemTypeEnum.bad
	| RetroItemTypeEnum.endorsement
	| RetroItemTypeEnum.idea;

export interface IRetroItem {
	ID: string; // see comments on RetroItem in Go why it's not `id` in all lower case
	type?: string; // provided only for root level items
	title: string;
	children?: IRetroItem[];
	likedUserIDs?: string[];
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
