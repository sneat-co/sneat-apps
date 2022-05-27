import { IWithTeamIDs } from './dto-models';
import { IPrice } from './dto-pricing';
import { ActivityType, Repeats, WeekdayCode2 } from './types';
import { UiState } from './ui-state';

export interface SlotParticipant {
	id: string;
	type: 'member' | 'contact';
	title: string;
}

export interface IHappeningBase {
	type: HappeningType;
	kind: HappeningKind;
	title: string;
	activityType?: ActivityType;
	levels?: Level[];
	slots?: IHappeningSlot[];
	assetIDs?: string[];
	memberIDs?: string[];
	contactIDs?: string[];
}

export interface IHappeningBrief extends IHappeningBase {
	id: string;
}

export interface IHappeningDto extends IHappeningBase, IWithTeamIDs {
	readonly teamDates?: string[]; // ISO date strings prefixed with teamID e.g. [`abc123:2019-12-01`, `abc123:2019-12-02`]
	readonly date?: string;
	participants?: SlotParticipant[];
	note?: string;
}

export function happeningBriefFromDto(id: string, dto: IHappeningDto): IHappeningBrief {
	return { id, ...dto };
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

export interface IDateTime {
	readonly date?: string;
	readonly time: string;
}

export interface ITiming {
	start: IDateTime;
	end?: IDateTime;
	durationMinutes?: number;
}

export interface IHappeningSlotTiming extends ITiming {
	repeats: Repeats;
	weekdays?: WeekdayCode2[];
	weeks?: number[];
	fortnightly?: {
		odd: IFortnightly;
		even: IFortnightly;
	};
}

export type Level = 'beginners' | 'intermediate' | 'advanced';

export interface IHappeningTask {
	readonly serviceProvider?: {
		readonly id: string;
		readonly title: string;
	};
}

export interface IHappeningSlot extends IHappeningSlotTiming {
	readonly id: string;
	readonly groupIds?: string[]; // TODO: What is this?
	location?: SlotLocation; // TODO: make readonly
}

export const emptyHappeningSlot: IHappeningSlot = {
	id: '',
	repeats: 'once',
	start: {date: '', time: ''},
}

export interface ISingleHappeningDto extends IHappeningDto {
	readonly dtStarts?: number; // UTC
	readonly dtEnds?: number;   // UTC
	readonly weekdays?: WeekdayCode2[];
	readonly prices?: IPrice[];
}

export interface DtoSingleTask extends ISingleHappeningDto {
	isCompleted: boolean;
	completion?: number; // In percents, max value is 100.
	responsibles?: SlotParticipant[];
}
