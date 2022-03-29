import { ICommuneRecord, ITitledRecord } from './dto-models';
import { ActivityType, EventType, Repeats, Weekday } from './types';
import { IPrice } from './dto-pricing';

export interface SlotParticipant {
	id: string;
	type: 'member' | 'contact';
	title: string;
}

export interface IHappening extends ICommuneRecord, ITitledRecord {
	// type: '';
	communeIds?: string[];
	assetId?: string;
	memberIds?: string[];
	contactIds?: string[];
	participants?: SlotParticipant[];
	note?: string;
}

export type HappeningKind = 'activity' | 'task';

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
	ends: string;
	repeats: Repeats;
	monthly?: MonthlyDay | 'week1' | 'week2' | 'week3' | 'week4';
	fortnightly?: {
		odd: IFortnightly;
		even: IFortnightly;
	};
	weekdays: Weekday[];
}

export type Level = 'beginners' | 'intermediate' | 'advanced';

export interface IHappeningTask {
	serviceProvider?: {
		id: string;
		title: string;
	};
}

export interface Slot {
	time: SlotTime;
	groupIds?: string[];
	levels?: Level[];
	location?: SlotLocation;
}

export interface IHappeningRegular extends IHappening, IHappeningTask {
	kind: HappeningKind;
	slots?: Slot[];
}

export interface IHappeningSingle extends IHappening {
	kind: 'activity' | 'task';
	dtStarts: number; // UTC
	dtEnds: number;   // UTC
	communeIdDates?: string[]; // ISO date strings prefixed with communeId e.g. [`abc123:2019-12-01`, `abc123:2019-12-02`]
	prices?: IPrice[];
}

export interface IHappeningActivity extends IHappening {
	levels?: Level[];
}

// tslint:disable-next-line:no-empty-interface
export interface DtoRegularTask extends IHappeningRegular {
	// liabilityId?: string;
}

export interface DtoSingleActivity extends IHappeningSingle, IHappeningActivity {
	type?: EventType;
	location?: SlotLocation;
}

export interface DtoSingleTask extends IHappeningSingle {
	isCompleted: boolean;
	completion?: number; // In percents, max value is 100.
	responsibles?: SlotParticipant[];
}

export interface DtoRegularActivity extends IHappeningRegular, IHappeningActivity {
	type?: ActivityType;
	// liabilityId?: string;
}
