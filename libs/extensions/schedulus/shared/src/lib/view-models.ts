import {
	HappeningType,
	IHappeningAdjustment,
	ISlotParticipant,
	ITiming,
	Level,
	Repeats,
	SlotLocation,
	WeekdayCode2,
	IHappeningContext,
} from '@sneat/mod-schedulus-core';

export interface ISchedulePageParams {
	readonly member?: string;
	readonly date?: string;
}

export interface NewHappeningParams {
	readonly type?: HappeningType;
	readonly wd?: WeekdayCode2;
	readonly date?: string;
}

export const sortSlotItems = (
	a: IHappeningSlotUiItem,
	b: IHappeningSlotUiItem,
): number =>
	a.timing.start.time === b.timing.start.time
		? a.title.localeCompare(b.title)
		: a.timing.start.time.localeCompare(b.timing.start.time);

export interface IHappeningSlotUiItem {
	// readonly id: string; Not sure how to make an ID yet
	readonly slotID: string;
	readonly adjustment?: IHappeningAdjustment;
	readonly wd?: WeekdayCode2;
	// readonly date: string;
	readonly error?: unknown;
	readonly happening: IHappeningContext;
	readonly title: string;
	readonly timing: ITiming;
	readonly repeats: Repeats;
	readonly location?: SlotLocation;
	readonly participants?: Readonly<Record<string, ISlotParticipant>>;
	readonly levels?: Level[];
}

export type SlotsByWeekday = Record<string, IHappeningSlotUiItem[]>;

export interface RecurringSlots {
	readonly byWeekday: SlotsByWeekday;
}

export const wd2: WeekdayCode2[] = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'];
const wd2js: WeekdayCode2[] = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];

export type WeekdayNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export function jsDayToWeekday(day: WeekdayNumber): WeekdayCode2 {
	if (day < 0 || day > 6) {
		throw new Error(`Unknown day number: ${day}`);
	}
	return wd2js[day];
}

export function getWd2(d: Date): WeekdayCode2 {
	return jsDayToWeekday(d.getDay() as WeekdayNumber);
}

export function dateToTimeOnlyStr(d: Date): string {
	const h = d.getHours().toString();
	const m = d.getMinutes().toString();
	return `${h.length === 1 ? `0${h}` : h}:${m.length === 1 ? `0${m}` : m}`;
}

export function timeToStr(n: number): string {
	const d = new Date(n);
	return dateToTimeOnlyStr(d);
}
