import { wdCodeToWeekdayLongName } from '@sneat/components';
import { dateToIso } from '@sneat/core';
import {
	ICalendarDayDbo,
	ITiming,
	WeekdayCode2,
	IHappeningContext,
} from '@sneat/mod-schedulus-core';
import { IErrorLogger } from '@sneat/logging';
import { HappeningService, CalendarDayService } from '@sneat/team-services';
import {
	BehaviorSubject,
	distinctUntilChanged,
	map,
	Observable,
	shareReplay,
	Subject,
	Subscription,
	takeUntil,
} from 'rxjs';
import { tap } from 'rxjs/operators';
import {
	getWd2,
	ISlotUIContext,
	RecurringSlots,
	sortSlotItems,
} from './view-models';

export class SpaceDay {
	private readonly destroyed = new Subject<void>();
	private readonly destroyed$ = this.destroyed.asObservable();

	private readonly _slots = new BehaviorSubject<ISlotUIContext[] | undefined>(
		undefined,
	);
	private recurringSlots?: RecurringSlots;
	private singles?: ISlotUIContext[];
	// private singles?: ISlotItem[];

	private spaceID?: string;
	public readonly date: Date;
	public readonly dateID: string;
	public readonly wd: WeekdayCode2;
	public readonly wdLongTitle: string;

	public readonly loadingEvents?: boolean;
	// readonly eventsLoaded?: boolean;

	public readonly slots$ = this._slots.asObservable().pipe(
		shareReplay(1),
		takeUntil(this.destroyed$),
		tap((slots) => console.log(`SpaceDay[${this.dateID}].slots$ =>`, slots)),
		map((slots) => slots?.sort(sortSlotItems)),
	);

	private calendarDayDbo?: ICalendarDayDbo | null;

	public get slots(): ISlotUIContext[] | undefined {
		return this._slots.value;
	}

	private readonly spaceID$: Observable<string | undefined>;

	private subscriptions: Subscription[] = [];

	constructor(
		spaceID$: Observable<string | undefined>, // do not declare it as member as we apply distinctUntilChanged() to it
		date: Date, // intentionally not marking as public here to have public fields in 1 place
		recurrings$: Observable<RecurringSlots>,
		private readonly errorLogger: IErrorLogger,
		private readonly happeningService: HappeningService,
		private readonly calendarDayService: CalendarDayService,
	) {
		if (!date) {
			throw new Error('missing required parameter: date');
		}
		this.date = date;
		this.dateID = dateToIso(date);
		if (this.dateID === '1970-01-01') {
			throw new Error('an attempt to set an empty date 1970-01-01');
		}
		console.log('SpaceDay.constructor()', this.dateID, this.date);
		this.spaceID$ = spaceID$.pipe(
			takeUntil(this.destroyed$),
			distinctUntilChanged(),
		);
		this.wd = getWd2(date);
		this.wdLongTitle = wdCodeToWeekdayLongName(this.wd);
		this.spaceID$.subscribe({
			next: this.processSpaceID,
			error: (err) => console.error('SpaceDay.spaceID$.subscribe.error', err),
		});
		this.subscribeForRecurrings(recurrings$);
	}

	public destroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}

	private readonly processSpaceID = (spaceID: string | undefined) => {
		if (spaceID === this.spaceID) {
			return;
		}
		console.log(`SpaceDay[${this.dateID}].processSpaceID(spaceID=${spaceID})`);
		this.spaceID = spaceID;
		this.singles = undefined;
		if (!this.spaceID) {
			this.recurringSlots = undefined;
		}
		this.subscriptions.forEach((s) => s.unsubscribe());
		this.subscriptions = [];
		this.subscribeForSingles();
		this.subscribeForCalendarDay();
	};

	private readonly subscribeForCalendarDay = (): void => {
		if (!this.spaceID) {
			return;
		}
		this.subscriptions.push(
			this.calendarDayService
				.watchSpaceDay({ id: this.spaceID }, this.dateID)
				.pipe(takeUntil(this.destroyed$))
				.subscribe({
					next: (calendarDay) => {
						const changed = this.calendarDayDbo != calendarDay.dbo;
						if (changed) {
							this.calendarDayDbo = calendarDay.dbo;
							this.joinRecurringsWithSinglesAndEmit();
						}
					},
					error: this.errorLogger.logErrorHandler(
						'Failed to load calendarDay record',
						{ show: false, feedback: false },
					),
				}),
		);
	};

	private readonly subscribeForSingles = (): void => {
		if (!this.spaceID) {
			console.error('Tried to subscribe for single happenings without teamID');
			return;
		}
		if (!this.dateID) {
			console.error('Tried to subscribe for single happenings without dateID');
			return;
		}
		try {
			const spaceID = this.spaceID;
			const date = this.dateID;
			console.log(
				`SpaceDay[${this.dateID}].subscribeForSingles(), spaceID=${spaceID}, date=${date}`,
			);
			this.subscriptions.push(
				this.happeningService
					.watchSinglesOnSpecificDay({ id: spaceID }, this.dateID)
					.pipe(takeUntil(this.destroyed$))
					.subscribe({
						next: this.processSingles,
						error: this.errorLogger.logErrorHandler(
							`Failed to get single happenings for a given day: spaceID=${spaceID}, date=${date}`,
						),
					}),
			);
		} catch (e) {
			this.errorLogger.logError(
				e,
				'Failed to subscribe for team day single happenings',
			);
		}
	};

	private readonly processSingles = (
		singleHappenings: IHappeningContext[],
	): void => {
		console.log('processSingles', singleHappenings);
		try {
			this.singles = [];

			singleHappenings.forEach((happening) => {
				const slotIDs: readonly string[] = Object.keys(
					happening.dbo?.slots || {},
				);
				const slot = slotIDs?.length && happening.dbo?.slots?.[slotIDs[0]];
				if (!slot) {
					return;
				}
				const timing: ITiming = {
					start: slot.start,
					end: slot.end,
					durationMinutes: slot.durationMinutes,
				};
				const slotItem: ISlotUIContext = {
					slot: { ...slot, id: slotIDs[0] },
					title: happening.brief?.title || happening?.dbo?.title || 'NO TITLE',
					timing,
					repeats: 'once',
					happening,
				};
				this.singles?.push(slotItem);
			});
			// console.log('SpaceDay[${this.isoID}].processSingles()`, changes, this.singles);
			this.joinRecurringsWithSinglesAndEmit();
		} catch (e) {
			this.errorLogger.logError(e, 'failed to process single happenings');
		}
	};

	private subscribeForRecurrings(
		recurrings$: Observable<RecurringSlots>,
	): void {
		this.subscriptions.push(
			recurrings$.pipe(takeUntil(this.destroyed$)).subscribe({
				next: this.processRecurrings,
			}),
		);
	}

	private readonly processRecurrings = (slots: RecurringSlots): void => {
		// console.log(
		// 	'SpaceDay[${this.dateID},wd=${this.wd}].processRecurrings(), ${
		// 		Object.keys(slots.byWeekday).length
		// 	} weekdays with slots:`,
		// 	slots,
		// );
		this.recurringSlots = slots;
		this.joinRecurringsWithSinglesAndEmit();
	};

	private joinRecurringsWithSinglesAndEmit(): void {
		console.log('joinRecurringsWithSinglesAndEmit() day=', this.dateID);
		const slots: ISlotUIContext[] = [];

		const weekdaySlots = this.recurringSlots?.byWeekday[this.wd]?.map(
			(wdSlot) => {
				// console.log(
				// 	'joinRecurringsWithSinglesAndEmit, wdSlot',
				// 	this.wd,
				// 	wdSlot,
				// 	this.scheduleDayDto,
				// );
				if (this.calendarDayDbo) {
					const adjustment =
						this.calendarDayDbo?.happeningAdjustments?.[wdSlot.happening.id]
							?.slots?.[wdSlot.slot.id];
					if (adjustment) {
						return { ...wdSlot, adjustment };
					}
				}
				return wdSlot;
			},
		);

		if (weekdaySlots?.length) {
			slots.push(...weekdaySlots);
		}
		if (this.singles) {
			slots.push(...this.singles);
		}

		// console.log(
		// 	'SpaceDay[id=${this.isoID}, wd=${this.wd}].joinRecurringsWithSinglesAndEmit()`,
		// 	`${weekdaySlots?.length || 0} recurrings:`, weekdaySlots,
		// 	`${this.singles?.length || 0} singles:`, weekdaySlots,
		// 	`=> ${slots.length} slots:`, slots);
		this._slots.next(slots);
	}
}
