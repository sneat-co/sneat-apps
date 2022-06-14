import {
	HappeningType, ICanceled,
	IHappeningSlotSingleRef,
	ISlotParticipant,
	ITiming,
	Level,
	Repeats,
	SlotLocation,
	WeekdayCode2,
} from '@sneat/dto';
import { IHappeningContext } from '@sneat/team/models';


export interface ISchedulePageParams {
	member?: string;
	date?: string;
}

export interface NewHappeningParams {
	type?: HappeningType;
	wd?: WeekdayCode2;
	date?: string;
}

export interface ISlotItem {
	// id: string; Not sure how to make an ID yet
	slotID: string;
	wd?: WeekdayCode2;
	// date: string;
	error?: unknown;
	happening: IHappeningContext;
	title: string;
	timing: ITiming;
	repeats: Repeats,
	location?: SlotLocation;
	participants?: ISlotParticipant[];
	levels?: Level[];
	canceled?: ICanceled;
}

export type SlotsByWeekday = { [wd: string]: ISlotItem[] };

export interface RecurringSlots {
	byWeekday: SlotsByWeekday;
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
	const h = d.getHours()
		.toString();
	const m = d.getMinutes()
		.toString();
	return `${h.length === 1 ? `0${h}` : h}:${m.length === 1 ? `0${m}` : m}`;
}

export function timeToStr(n: number): string {
	const d = new Date(n);
	return dateToTimeOnlyStr(d);
}
