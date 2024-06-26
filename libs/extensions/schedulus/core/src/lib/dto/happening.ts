import { IWithRelatedOnly, IWithTeamIDs } from '@sneat/dto';
import { ActivityType, RepeatPeriod, WeekdayCode2 } from './happening-types';
import { IWithStringID } from './todo_move_funcs';

export interface ISlotParticipant {
	readonly roles?: string[];
	// readonly type: 'member' | 'contact';
	// readonly title: string;
}

export interface IHappeningParticipant {
	readonly roles?: string[];
	// readonly type: 'member' | 'contact';
	// readonly title: string;
}

export type TermUnit =
	| 'single'
	| 'second'
	| 'minute'
	| 'hour'
	| 'day'
	| 'week'
	| 'month'
	| 'quarter'
	| 'year';

export interface ITerm {
	readonly length: number;
	readonly unit: TermUnit;
}

export type CurrencyCode = 'USD' | 'EUR' | 'RUB' | string;

export interface IAmount {
	readonly currency: CurrencyCode;
	readonly value: number;
}

export interface IHappeningPrice {
	readonly id: string;
	readonly term: ITerm;
	readonly amount: IAmount;
	readonly expenseQuantity?: number;
}

export interface IHappeningBase extends IWithRelatedOnly {
	readonly type: HappeningType;
	readonly status: HappeningStatus;
	readonly kind: HappeningKind;
	readonly activityType?: ActivityType; // TODO: Is it same as HappeningKind?
	readonly title: string;
	readonly levels?: Level[];
	// readonly contactIDs?: readonly string[]; // obsolete
	readonly slots?: Readonly<Record<string, IHappeningSlot>>;
	readonly prices?: readonly IHappeningPrice[];
	// readonly participants?: Record<string, Readonly<IHappeningParticipant>>;
}

export type IHappeningBrief = IHappeningBase;

export interface IWithDates {
	readonly dates?: string[];
}

export interface IWithTeamDates extends IWithTeamIDs, IWithDates {
	readonly teamDates?: string[]; // ISO date strings prefixed with teamID e.g. [`abc123:2019-12-01`, `abc123:2019-12-02`]
}

export interface IHappeningDto extends IHappeningBrief, IWithTeamDates {}

export function validateHappeningDto(dto: IHappeningDto): void {
	if (!dto.title) {
		throw new Error('happening has no title');
	}
	if (dto.title !== dto.title.trim()) {
		throw new Error(
			'happening title has leading or closing whitespace characters',
		);
	}
	switch (dto.type) {
		case 'single':
			break;
		case 'recurring':
			break;
		default:
			if (!dto.type) {
				throw new Error('happening has no type');
			}
			throw new Error('happening has unknown type: ' + dto.type);
	}
	if (!dto.type) {
		throw new Error('happening has no type');
	}
	if (!Object.keys(dto.slots || {})?.length) {
		throw new Error('!dto.slots?.length');
	}
	switch (dto.type) {
		case 'single':
			Object.entries(dto.slots || {}).forEach(([slotID, slot]) =>
				validateSingleHappeningSlot(slotID, slot),
			);
			break;
		case 'recurring':
			Object.entries(dto.slots || {}).forEach(([slotID, slot]) =>
				validateRecurringHappeningSlot(slotID, slot),
			);
			break;
	}
}

export function validateRecurringHappeningSlot(
	slotID: string,
	slot: IHappeningSlot,
): void {
	if (slot.repeats === 'once' || slot.repeats === 'UNKNOWN') {
		throw new Error(
			`slots[${slotID}]: slot.repeats is not valid for recurring happening: ${slot.repeats}`,
		);
	}
	validateHappeningSlot(slotID, slot);
}

export function validateSingleHappeningSlot(
	slotID: string,
	slot: IHappeningSlot,
): void {
	if (slot.repeats != 'once') {
		throw new Error(
			`slots[${slotID}]: slot repeats is not 'once': ${slot.repeats}`,
		);
	}
	validateHappeningSlot(slotID, slot);
}

function validateHappeningSlot(slotID: string, slot: IHappeningSlot): void {
	if (
		!slot.start?.time &&
		!(slot.repeats.startsWith('monthly') || slot.repeats.startsWith('yearly'))
	) {
		throw new Error(`slots[${slotID}]: slot has no start time: ${slot}`);
	}
}

export type HappeningType = 'recurring' | 'single';

export type HappeningStatus = 'draft' | 'active' | 'canceled' | 'archived';

export type HappeningKind = 'appointment' | 'activity' | 'task';

export interface SlotLocation {
	readonly title?: string;
	readonly address?: string;
}

interface IFortnightly {
	readonly title: string;
}

/*
// tslint:disable-next-line:no-magic-numbers
type MonthlyDay = -5 | -4 | -3 | -2 | -1
// tslint:disable-next-line:no-magic-numbers
	| 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
// tslint:disable-next-line:no-magic-numbers
	| 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19
// tslint:disable-next-line:no-magic-numbers
	| 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28;
*/

export interface IDateTime {
	readonly date?: string;
	readonly time?: string;
}

export interface ITiming {
	readonly start?: IDateTime;
	readonly end?: IDateTime;
	readonly durationMinutes?: number;
}

export interface IHappeningSlotSingleRef {
	readonly repeats: RepeatPeriod;
	readonly weekday?: WeekdayCode2;
	readonly week?: number;
}

export type Month =
	| 'January'
	| 'February'
	| 'March'
	| 'April'
	| 'May'
	| 'June'
	| 'July'
	| 'August'
	| 'September'
	| 'October'
	| 'November'
	| 'December';

export interface IHappeningSlotTiming extends ITiming {
	readonly repeats: RepeatPeriod;
	readonly weekdays?: readonly WeekdayCode2[];
	readonly day?: number;
	readonly month?: Month;
	readonly weeks?: readonly number[];
	readonly fortnightly?: Readonly<{
		readonly odd: IFortnightly;
		readonly even: IFortnightly;
	}>;
}

export type Level = 'beginners' | 'intermediate' | 'advanced';

export interface IHappeningTask {
	readonly serviceProvider?: {
		readonly id: string;
		readonly title: string;
	};
}

export interface IHappeningSlot extends IHappeningSlotTiming {
	readonly location?: SlotLocation;
	readonly groupIds?: string[]; // TODO: What is this?
}

export type IHappeningSlotWithID = IWithStringID<IHappeningSlot>;

export const emptyTiming: ITiming = {
	// durationMinutes: 0,
};

export const emptyHappeningSlot: IHappeningSlotWithID = {
	id: '',
	repeats: 'UNKNOWN',
	...emptyTiming,
};

export interface ISingleHappeningDto extends IHappeningDto {
	readonly dtStarts?: number; // UTC
	readonly dtEnds?: number; // UTC
	readonly weekdays?: WeekdayCode2[];
}

export interface DtoSingleTask extends ISingleHappeningDto {
	readonly isCompleted: boolean;
	readonly completion?: number; // In percents, max value is 100.
}
