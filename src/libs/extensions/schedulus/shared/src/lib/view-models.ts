import { wdCodeToWeekdayLongName } from '@sneat/components';
import { dateToIso } from '@sneat/core';
import {
	HappeningType,
	ITiming,
	Level,
	Repeats,
	SlotLocation,
	SlotParticipant,
	WeekdayCode2,
} from '@sneat/dto';
import { IErrorLogger } from '@sneat/logging';
import { IHappeningContext } from '@sneat/team/models';
import { HappeningService } from '@sneat/team/services';
import { BehaviorSubject, Observable, shareReplay, Subject, takeUntil } from 'rxjs';
import { tap } from 'rxjs/operators';


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
	error?: unknown;
	happening: IHappeningContext;
	title: string;
	timing: ITiming;
	repeats: Repeats,
	location?: SlotLocation;
	participants?: SlotParticipant[];
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
	private singles?: ISlotItem[];
	// private singles?: ISlotItem[];

	private teamID?: string;
	public readonly date: Date;
	public readonly dateID: string;
	public isoID: string; // TODO: is it same as dateID?
	public readonly wd: WeekdayCode2;
	public readonly wdLongTitle: string;
	readonly loadingEvents?: boolean;
	readonly eventsLoaded?: boolean;
	public readonly slots$ = this._slots.asObservable().pipe(
		shareReplay(1),
		takeUntil(this.destroyed),
		tap(slots => console.log(`TeamDay[${this.isoID}].slots$ =>`, slots)),
	);

	public get slots(): ISlotItem[] | undefined {
		return this._slots.value;
	}

	constructor(
		private readonly teamID$: Observable<string | undefined>, // intentionally not marking as public here to have public fields in 1 place
		date: Date, // intentionally not marking as public here to have public fields in 1 place
		recurrings$: Observable<RecurringSlots>,
		private readonly errorLogger: IErrorLogger,
		// private readonly afs: AngularFirestore,
		private readonly happeningService: HappeningService,
	) {
		if (!date) {
			throw new Error('missing required parameter: date');
		}
		this.date = date;
		this.dateID = dateToIso(date);
		if (!this.dateID) {
			throw new Error('dateID is missing');
		}
		teamID$
			.subscribe({
				next: this.processTeamID,
			});
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

	private readonly processTeamID = (teamID: string | undefined) => {
		console.log(`TeamDay[${this.isoID}].processTeamID(teamID=${teamID})`);
		this.teamID = teamID;
		this.singles = undefined;
		if (!this.teamID) {
			this.recurringSlots = undefined;
		}
		this.subscribeForSingles();
	};

	private readonly subscribeForSingles = (): void => {
		if (!this.teamID ) {
			console.error('Tried to subscribe for single happenings without teamID');
			return;
		}
		if (!this.dateID ) {
			console.error('Tried to subscribe for single happenings without dateID');
			return;
		}
		try {
			const teamID = this.teamID;
			const date = this.dateID;
			console.log(`TeamDay[${this.isoID}].subscribeForSingles(), teamID=${teamID}, date=${date}`);
			this.happeningService
				.watchSinglesOnSpecificDay(this.teamID, this.dateID)
				.pipe(
					takeUntil(this.destroyed),
				)
				.subscribe({
					next: this.processSingles,
					error: this.errorLogger.logErrorHandler(`Failed to get single happenings for a given day: teamID=${teamID}, date=${date}`),
				});
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to subscribe for team day single happenings');
		}
	}

	private readonly processSingles = (singleHappenings: IHappeningContext[]): void => {
		try {
			this.singles = [];

			singleHappenings.forEach(happening => {
				const slot = happening.dto?.slots && happening.dto?.slots[0];
				if (!slot) {
					return;
				}
				const timing: ITiming = {
					start: slot.start,
					end: slot.end,
					durationMinutes: slot.durationMinutes,
				};
				const slotItem: ISlotItem = {
					title: happening.brief?.title || happening?.dto?.title || 'NO TITLE',
					timing,
					repeats: 'once',
					happening,
				};
				this.singles?.push(slotItem);
			});
			// console.log(`TeamDay[${this.isoID}].processSingles()`, changes, this.singles);
			this.joinRecurringsWithSinglesAndEmit();
		} catch (e) {
			this.errorLogger.logError(e, 'failed to process single happenings');
		}
	};

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
		// console.log(`TeamDay[${this.isoID}].processRecurrings(), ${Object.keys(slots.byWeekday).length} weekdays with slots:`, slots);
		this.recurringSlots = slots;
		this.joinRecurringsWithSinglesAndEmit();
	};

	private joinRecurringsWithSinglesAndEmit(): void {
		const slots: ISlotItem[] = [];
		const weekdaySlots = this.recurringSlots?.byWeekday[this.wd];
		if (weekdaySlots?.length) {
			slots.push(...weekdaySlots);
		}
		if (this.singles) {
			slots.push(...this.singles);
		}
		// console.log(
		// 	`TeamDay[id=${this.isoID}, wd=${this.wd}].joinRecurringsWithSinglesAndEmit()`,
		// 	`${weekdaySlots?.length || 0} recurrings:`, weekdaySlots,
		// 	`${this.singles?.length || 0} singles:`, weekdaySlots,
		// 	`=> ${slots.length} slots:`, slots);
		this._slots.next(slots);
	}
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
