import { wdCodeToWeekdayLongName } from '@sneat/components';
import {
	HappeningKind,
	HappeningType,
	IRecurringHappeningDto,
	ISingleHappeningDto,
	Level,
	SlotLocation,
	SlotParticipant,
	IRecurringSlotTiming,
	Weekday, ITiming, Repeats,
} from '@sneat/dto';
import { BehaviorSubject, Observable, Subject, takeUntil } from 'rxjs';


export interface NewHappeningParams {
	type: 'regular' | 'single';
	weekday?: Day;
}

export interface SlotItem {
	error?: any;
	type: HappeningType;
	kind: HappeningKind;
	title: string;
	timing: ITiming;
	repeats: Repeats,
	location?: SlotLocation;
	participants?: SlotParticipant[];
	recurring?: IRecurringHappeningDto | null; // We need it to pass to regular page
	single?: ISingleHappeningDto;     // We need it to pass to single page
	levels?: Level[];
}

export type SlotsByWeekday = { [wd: string]: SlotItem[] };

export interface RecurringSlots {
	byWeekday: SlotsByWeekday;
}

export interface Day {
	readonly date?: Date;
	readonly wd: Weekday;
	readonly title: string;
	slots?: SlotItem[];
	readonly loadingEvents?: boolean;
	readonly eventsLoaded?: boolean;
}

export class DaySlotsProvider {

	public readonly wd: Weekday;
	public readonly wdLongTitle: string;
	private readonly destroyed = new Subject<boolean>();
	private recurringSlots?: RecurringSlots;
	private singles?: SlotItem[];

	private readonly _slots = new BehaviorSubject<SlotItem[] | undefined>(undefined);
	public readonly slots$ = this._slots.asObservable();

	constructor(
		public readonly date: Date,
		recurrings$: Observable<RecurringSlots>,
	) {
		this.wd = getWd2(date);
		this.wdLongTitle = wdCodeToWeekdayLongName(this.wd);
		this.subscribeForRecurrings(recurrings$);
	}

	public get slots(): SlotItem[] | undefined {
		return this._slots.value;
	}

	public destroy(): void {
		this.destroyed.next(true);
		this.destroyed.complete();
	}

	private subscribeForRecurrings(recurrings$: Observable<RecurringSlots>): void {
		recurrings$
			.pipe(
				takeUntil(this.destroyed),
			)
			.subscribe({
				next: this.processRecurrings,
			});
	}

	private readonly processRecurrings = (slots: RecurringSlots): void => {
		this.recurringSlots = slots;
		this.joinRecurringsWithSinglesAndEmit();
	};

	private joinRecurringsWithSinglesAndEmit(): void {
		const slots = [];
		const weekdaySlots = this.recurringSlots?.byWeekday[this.wd];
		if (weekdaySlots?.length) {
			slots.push(...weekdaySlots);
		}
		this._slots.next(slots);
	}
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

export function getWd2(d: Date): Weekday {
	return jsDayToWeekday(d.getDay() as wdNumber);
}


export function timeToStr(n: number): string {
	const d = new Date(n);
	const h = d.getHours()
		.toString();
	const m = d.getMinutes()
		.toString();
	return `${h.length === 1 ? `0${h}` : h}:${m.length === 1 ? `0${m}` : m}`;
}
