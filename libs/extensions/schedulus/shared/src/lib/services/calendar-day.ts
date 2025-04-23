import { effect, Signal, signal } from '@angular/core';
import { dateToIso } from '@sneat/core';
import { IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/space-models';
import {
	BehaviorSubject,
	Observable,
	shareReplay,
	Subject,
	Subscription,
	takeUntil,
} from 'rxjs';
import {
	getWd2,
	ISlotUIContext,
	RecurringSlots,
	sortSlotItems,
	ICalendarDayDbo,
	WeekdayCode2,
	wdCodeToWeekdayLongName,
	IHappeningContext,
	ITiming,
} from '@sneat/mod-schedulus-core';
import { HappeningService } from './happening.service';
import { CalendarDayService } from './calendar-day.service';
import { runInInjectionContext, Injector, EffectRef } from '@angular/core';

export interface ICalendarDayInput {
	readonly spaceID: string; // Should we use observable on ISpaceContext as we might want to use space settings?
	readonly $recurringSlots: Signal<RecurringSlots | undefined>;

	// Obsolete - to be replaced with `$recurringSlots`
	readonly recurringSlots$: Observable<RecurringSlots>;
}

export class CalendarDay {
	private readonly destroyed$ = new Subject<void>();

	private recurringSlots?: RecurringSlots;
	private singles?: ISlotUIContext[];

	private _spaces: readonly ISpaceContext[] = [];

	public get spaces(): readonly ISpaceContext[] {
		return this._spaces;
	}

	public readonly dateID: string;
	public readonly wd: WeekdayCode2;
	public readonly wdLongTitle: string;

	private readonly _isLoading = signal(true);

	public readonly $isLoading = this._isLoading.asReadonly();

	private readonly $slots = signal<ISlotUIContext[] | undefined>(undefined);

	private readonly _slots = new BehaviorSubject<ISlotUIContext[] | undefined>(
		undefined,
	);

	public readonly slots$ = this._slots.asObservable().pipe(
		shareReplay(1),
		takeUntil(this.destroyed$),
		// tap((slots) => console.log(`SpaceDay[${this.dateID}].slots$ =>`, slots)),
		// map((slots) => slots?.sort(sortSlotItems)),
	);

	private calendarDayDbo?: ICalendarDayDbo | null;

	public get slots(): ISlotUIContext[] | undefined {
		return this._slots.value;
	}

	private readonly subscriptions: Subscription[] = [];

	private effectRef?: EffectRef;

	constructor(
		public readonly date: Date,
		injector: Injector,
		$input: Signal<readonly ICalendarDayInput[]>,
		private readonly errorLogger: IErrorLogger,
		// TODO: document why we need both HappeningService & CalendarDayService
		private readonly happeningService: HappeningService,
		private readonly calendarDayService: CalendarDayService,
	) {
		if (!date) {
			throw new Error('missing required parameter: date');
		}
		this.dateID = dateToIso(date);
		if (this.dateID === '1970-01-01') {
			throw new Error('an attempt to set an empty date 1970-01-01');
		}
		this.date = date;
		console.log('SpaceDay.constructor()', this.dateID, this.date);
		this.wd = getWd2(date);
		this.wdLongTitle = wdCodeToWeekdayLongName(this.wd);

		runInInjectionContext(injector, () => {
			this.effectRef = effect(() => {
				const inputs = $input();
				console.log('CalendarDay.effect($input) =>', this.dateID, inputs);
				inputs.forEach((input) => {
					this.subscriptions.forEach((s) => s.unsubscribe());
					this.subscriptions.length = 0;
					this.processSpaceID(input.spaceID);
					this.subscribeForRecurrings(input.recurringSlots$);
				});
			});
		});
	}

	public destroy(): void {
		this.effectRef?.destroy();
		this.destroyed$.next();
		this.destroyed$.complete();
	}

	private readonly processSpaceID = (spaceID: string | undefined) => {
		console.log(`SpaceDay[${this.dateID}].processSpaceID(spaceID=${spaceID})`);
		this.singles = undefined;
		if (!spaceID) {
			this.recurringSlots = undefined;
		}
		if (spaceID) {
			this.subscribeForSingles(spaceID);
			this.subscribeForCalendarDay(spaceID);
		}
	};

	private readonly subscribeForCalendarDay = (spaceID: string): void => {
		this.subscriptions.push(
			this.calendarDayService
				.watchSpaceDay({ id: spaceID }, this.dateID)
				.pipe(takeUntil(this.destroyed$))
				.subscribe({
					next: (calendarDay) => {
						const changed = this.calendarDayDbo != calendarDay.dbo;
						if (changed) {
							this.calendarDayDbo = calendarDay.dbo;
							console.log(
								'Received calendarDay record for ' + this.dateID,
								calendarDay,
							);
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

	private readonly subscribeForSingles = (spaceID: string): void => {
		if (!this.dateID) {
			console.error('Tried to subscribe for single happenings without dateID');
			return;
		}
		try {
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
		console.log(
			`SpaceDay[${this.dateID},wd=${this.wd}].processRecurrings(), ${
				Object.keys(slots.byWeekday).length
			} weekdays with slots:`,
			slots,
		);
		this.recurringSlots = slots;
		this.joinRecurringsWithSinglesAndEmit();
	};

	private joinRecurringsWithSinglesAndEmit(): void {
		console.log('joinRecurringsWithSinglesAndEmit() day=', this.dateID);
		let slots: ISlotUIContext[] = [];

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
						return { ...wdSlot, adjustment: adjustment };
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

		slots = slots.sort(sortSlotItems);
		this._slots.next(slots);
		this.$slots.set(slots);

		this._isLoading.set(false);

		console.log(
			'SpaceDay[${this.dateID}].joinRecurringsWithSinglesAndEmit() _isLoading=false',
			slots,
		);
	}
}
