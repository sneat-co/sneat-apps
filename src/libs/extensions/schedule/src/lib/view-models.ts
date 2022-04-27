import { AngularFirestore, DocumentChangeAction } from '@angular/fire/compat/firestore';
import { wdCodeToWeekdayLongName } from '@sneat/components';
import { dateToIso } from '@sneat/core';
import {
	happeningBriefFromDto,
	HappeningType,
	IHappeningBrief,
	IHappeningDto,
	ISingleHappeningDto,
	ITiming,
	Level,
	Repeats,
	SlotLocation,
	SlotParticipant,
	WeekdayCode2,
} from '@sneat/dto';
import { IErrorLogger } from '@sneat/logging';
import { IHappeningContext } from '@sneat/team/models';
import { BehaviorSubject, Observable, shareReplay, Subject, takeUntil } from 'rxjs';
import { tap } from 'rxjs/operators';


export interface NewHappeningParams {
	type?: HappeningType;
	wd?: WeekdayCode2;
	date?: Date;
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
	public readonly wd: WeekdayCode2;
	public readonly wdLongTitle: string;
	public isoID: string;
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
		private readonly afs: AngularFirestore,
	) {
		teamID$
			.subscribe({
				next: this.processTeamID,
			});
		this.date = date;
		this.dateID = date.toISOString().substring(0, 10);
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

	private subscribeForSingles(): void {
		if (!this.teamID) {
			return;
		}
		try {
			const teamDate = `${this.teamID}:${this.dateID}`;
			console.log(`TeamDay[${this.isoID}].subscribeForSingles(), teamID:dateID=${teamDate}`);
			this.afs
				.collection<IHappeningDto>('happenings', ref => ref.where('teamDates', 'array-contains', teamDate))
				.snapshotChanges()
				.pipe(
					// takeUntil(this.teamID$),
				)
				.subscribe({
					next: this.processSingles,
					error: this.errorLogger.logErrorHandler(`Failed to get single happenings for a given day: ${teamDate}`),
				});
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to subscribe for team day single happenings');
		}
	}

	private readonly processSingles = (changes: DocumentChangeAction<IHappeningDto>[]) => {
		try {
			this.singles = [];

			changes.forEach(value => {
				const id: string = value.payload.doc.ref.id;
				const dto: IHappeningDto = value.payload.doc.data();
				const brief: IHappeningBrief = happeningBriefFromDto(id, dto);
				const slot = dto.slots && dto.slots[0];
				if (!slot) {
					return;
				}
				const timing: ITiming = {
					start: slot.start,
					end: slot.end,
					durationMinutes: slot.durationMinutes,
				};
				const slotItem: ISlotItem = {
					title: brief.title,
					timing,
					repeats: 'once',
					happening: {id, brief, dto},
				};
				this.singles?.push(slotItem);
			});
			console.log(`TeamDay[${this.isoID}].processSingles()`, changes, this.singles);
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
		console.log(`TeamDay[${this.isoID}].processRecurrings(), slots:`, slots);
		this.recurringSlots = slots;
		this.joinRecurringsWithSinglesAndEmit();
	};

	private joinRecurringsWithSinglesAndEmit(): void {
		console.log(`TeamDay[${this.isoID}].joinRecurringsWithSinglesAndEmit(), wd=${this.wd}, recurringSlots:`,
			this.recurringSlots, ', singles:', this.singles);
		const slots: ISlotItem[] = [];
		const weekdaySlots = this.recurringSlots?.byWeekday[this.wd];
		if (weekdaySlots?.length) {
			slots.push(...weekdaySlots);
		}
		if (this.singles) {
			slots.push(...this.singles);
		}
		console.log(`TeamDay[${this.isoID}].joinRecurringsWithSinglesAndEmit() => slots:`, slots);
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
