import {
	IHappeningActivity, IHappeningRegular,
	IHappeningSingle,
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
	regular?: IHappeningRegular; // We need it to pass to regular page
	single?: IHappeningSingle;     // We need it to pass to single page
	activity?: IHappeningActivity;
	levels?: Level[];
}

export interface SlotsGroup {
	readonly wd: Weekday;
	readonly title: string;
	readonly slots: SlotItem[];
	readonly date?: Date;
	readonly loadingEvents?: boolean;
	readonly eventsLoaded?: boolean;
}

export const wd2: Weekday[] = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'];

// tslint:disable-next-line:no-magic-numbers
export type wdNumber = 0|1|2|3|4|5|6;

export function jsDayToWeekday(day: wdNumber): Weekday {
	switch (day) {
		case 0:
			return 'su';
		case 1:
			return 'mo';
		// tslint:disable-next-line:no-magic-numbers
		case 2:
			return 'tu';
		// tslint:disable-next-line:no-magic-numbers
		case 3:
			return 'we';
		// tslint:disable-next-line:no-magic-numbers
		case 4:
			return 'th';
		// tslint:disable-next-line:no-magic-numbers
		case 5:
			return 'fr';
		// tslint:disable-next-line:no-magic-numbers
		case 6:
			return 'sa';
		default:
			throw new Error(`Unknown day number: ${day}`);
	}
}

export function timeToStr(n: number): string {
	const d = new Date(n);
	const h = d.getHours()
		.toString();
	const m = d.getMinutes()
		.toString();
	return `${h.length === 1 ? `0${h}`  : h}:${m.length === 1 ? `0${m}` : m}`;
}
