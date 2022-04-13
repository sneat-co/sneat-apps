import { ITeamsRecord } from './dto-models';
import { IPrice } from './dto-pricing';
import { ActivityType, EventType, Repeats, Weekday } from './types';
import { UiState } from './ui-state';

export interface SlotParticipant {
	id: string;
	type: 'member' | 'contact';
	title: string;
}

export interface IHappeningBase {
	title: string;
	type: HappeningType;
	activityType?: ActivityType;
	kind: HappeningKind;
	levels?: Level[];
}

export interface IHappeningBrief extends IHappeningBase {
	id: string;
}

export interface IHappeningDto extends IHappeningBase, ITeamsRecord {
	assetIDs?: string[];
	memberIDs?: string[];
	contactIDs?: string[];
	participants?: SlotParticipant[];
	note?: string;
}

export type HappeningType = 'recurring' | 'single';

export type HappeningKind = 'appointment' | 'activity' | 'task';

export interface SlotLocation {
	title?: string;
	address?: string;
}

interface IFortnightly {
	title: string;
}

// tslint:disable-next-line:no-magic-numbers
type MonthlyDay = -5 | -4 | -3 | -2 | -1
// tslint:disable-next-line:no-magic-numbers
	| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
// tslint:disable-next-line:no-magic-numbers
	| 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19
// tslint:disable-next-line:no-magic-numbers
	| 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28;

export interface SlotTime {
	starts: string;
	ends?: string;
	repeats: Repeats;
	monthly?: MonthlyDay | 'week1' | 'week2' | 'week3' | 'week4';
	fortnightly?: {
		odd: IFortnightly;
		even: IFortnightly;
	};
	weekdays?: Weekday[];
}

export type Level = 'beginners' | 'intermediate' | 'advanced';

export interface IHappeningTask {
	serviceProvider?: {
		id: string;
		title: string;
	};
}

export interface Slot {
	readonly id: string;
	time: SlotTime;
	groupIds?: string[];
	// levels?: Level[];
	location?: SlotLocation;
}

export interface IRecurringHappeningDto extends IHappeningDto, IHappeningTask {
	type: 'recurring';
	kind: HappeningKind;
	slots?: Slot[];
}

export interface IRecurringActivityWithUiState {
	readonly id: string;
	readonly dto: IRecurringHappeningDto;
	readonly state: UiState;
}

export interface ISingleHappeningDto extends IHappeningDto {
	dtStarts?: number; // UTC
	dtEnds?: number;   // UTC
	communeIdDates?: string[]; // ISO date strings prefixed with communeId e.g. [`abc123:2019-12-01`, `abc123:2019-12-02`]
	prices?: IPrice[];
}

export interface IHappeningActivity extends IHappeningDto {
}

export interface DtoSingleTask extends ISingleHappeningDto {
	isCompleted: boolean;
	completion?: number; // In percents, max value is 100.
	responsibles?: SlotParticipant[];
}
