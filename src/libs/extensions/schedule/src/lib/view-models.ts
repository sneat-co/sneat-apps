import { wdCodeToWeekdayLongName } from '@sneat/components';
import { dateToIso } from '@sneat/core';
import {
	HappeningKind,
	HappeningType,
	IRecurringHappeningDto,
	ISingleHappeningDto,
	ITiming,
	Level,
	Repeats,
	SlotLocation,
	SlotParticipant,
	WeekdayCode2,
} from '@sneat/dto';
import { BehaviorSubject, Observable, shareReplay, Subject, takeUntil } from 'rxjs';
import { tap } from 'rxjs/operators';


export interface NewHappeningParams {
	type?: HappeningType;
	wd?: WeekdayCode2;
	date?: Date;
}

export interface ISlotItem {
	// id: string; Not sure how to make an ID yet
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

export type SlotsByWeekday = { [wd: string]: ISlotItem[] };

export interface RecurringSlots {
	byWeekday: SlotsByWeekday;
}

export class TeamDay {

	private readonly destroyed = new Subject<void>();
	private readonly _slots = new BehaviorSubject<ISlotItem[] | undefined>(undefined);
	private recurringSlots?: RecurringSlots;
	// private singles?: ISlotItem[];

	public readonly date: Date;
	public readonly wd: WeekdayCode2;
	public readonly wdLongTitle: string;
	public isoID: string;
	readonly loadingEvents?: boolean;
	readonly eventsLoaded?: boolean;
	public readonly slots$ = this._slots.asObservable().pipe(
		shareReplay(1),
		takeUntil(this.destroyed),
		tap(slots => console.log(`DaySlotsProvider[${this.isoID}].slots$ =>`, slots)),
	);

	public get slots(): ISlotItem[] | undefined {
		return this._slots.value;
	}

	constructor(
		date: Date, // intentionally not marking as public here to have public fields in 1 place
		recurrings$: Observable<RecurringSlots>,
	) {
		this.date = date;
		this.wd = getWd2(date);
		this.isoID = dateToIso(date);
		if (this.isoID === '1970-01-01') {
			throw new Error('an attempt to set an empty date 1970-01-01');
		}
		this.wdLongTitle = wdCodeToWeekdayLongName(this.wd);
		this.subscribeForRecurrings(recurrings$);
	}

	public destroy(): void {
		this.destroyed.next();
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
		console.log(`DaySlotsProvider[${this.isoID}].processRecurrings(), slots:`, slots);
		this.recurringSlots = slots;
		this.joinRecurringsWithSinglesAndEmit();
	};

	private joinRecurringsWithSinglesAndEmit(): void {
		console.log(`DaySlotsProvider[${this.isoID}].joinRecurringsWithSinglesAndEmit(), wd=${this.wd}, recurringSlots:`, this.recurringSlots);
		const slots = [];
		const weekdaySlots = this.recurringSlots?.byWeekday[this.wd];
		if (weekdaySlots?.length) {
			slots.push(...weekdaySlots);
		}
		console.log(`DaySlotsProvider[${this.isoID}].joinRecurringsWithSinglesAndEmit() => slots:`, slots);
		this._slots.next(slots);
	}
}

export const wd2: WeekdayCode2[] = ['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'];
const wd2js: WeekdayCode2[] = ['su', 'mo', 'tu', 'we', 'th', 'fr', 'sa'];

export type wdNumber = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export function jsDayToWeekday(day: wdNumber): WeekdayCode2 {
	if (day < 0 || day > 6) {
		throw new Error(`Unknown day number: ${day}`);
	}
	return wd2js[day];
}

export function getWd2(d: Date): WeekdayCode2 {
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
