import {
	IRecurringHappeningDto,
	ISingleHappeningDto,
	Level,
	SlotLocation,
	SlotParticipant,
	SlotTime,
	Weekday,
} from '@sneat/dto';


export interface NewHappeningParams {
	type: 'regular' | 'single';
	weekday?: SlotsGroup;
}

export interface SlotItem {
	kind: 'regular-activity' | 'regular-task' | 'event' | 'task';
	title: string;
	time: SlotTime;
	location?: SlotLocation;
	participants?: SlotParticipant[];
	recurring?: IRecurringHappeningDto | null; // We need it to pass to regular page
	single?: ISingleHappeningDto;     // We need it to pass to single page
	levels?: Level[];
}

export interface SlotsGroup {
	readonly wd: Weekday;
	readonly title: string;
	slots: SlotItem[];
	date?: Date;
	readonly loadingEvents?: boolean;
	readonly eventsLoaded?: boolean;
}

export const wd2: Weekday[] = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'];
const wd2js: Weekday[] = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];

export type wdNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export function jsDayToWeekday(day: wdNumber): Weekday {
	if (day < 0 || day > 6) {
		throw new Error(`Unknown day number: ${day}`);
	}
	return wd2js[day];
}

export function timeToStr(n: number): string {
	const d = new Date(n);
	const h = d.getHours()
		.toString();
	const m = d.getMinutes()
		.toString();
	return `${h.length === 1 ? `0${h}` : h}:${m.length === 1 ? `0${m}` : m}`;
}
