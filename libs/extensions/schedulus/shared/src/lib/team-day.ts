import { wdCodeToWeekdayLongName } from '@sneat/components';
import { dateToIso } from '@sneat/core';
import {
	IScheduleDayDto,
	ITiming,
	WeekdayCode2,
	IHappeningContext,
} from '@sneat/mod-schedulus-core';
import { IErrorLogger } from '@sneat/logging';
import { HappeningService, ScheduleDayService } from '@sneat/team-services';
import {
	BehaviorSubject,
	Observable,
	shareReplay,
	Subject,
	takeUntil,
} from 'rxjs';
import { tap } from 'rxjs/operators';
import { getWd2, ISlotItem, RecurringSlots } from './view-models';

export class TeamDay {
	private readonly destroyed = new Subject<void>();
	private readonly _slots = new BehaviorSubject<ISlotItem[] | undefined>(
		undefined,
	);
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
		tap((slots) => console.log(`TeamDay[${this.isoID}].slots$ =>`, slots)),
	);

	private scheduleDayDto?: IScheduleDayDto | null;

	public get slots(): ISlotItem[] | undefined {
		return this._slots.value;
	}

	constructor(
		private readonly teamID$: Observable<string | undefined>,
		date: Date, // intentionally not marking as public here to have public fields in 1 place
		recurrings$: Observable<RecurringSlots>,
		private readonly errorLogger: IErrorLogger,
		private readonly happeningService: HappeningService,
		private readonly scheduleDayService: ScheduleDayService,
	) {
		if (!date) {
			throw new Error('missing required parameter: date');
		}
		this.date = date;
		this.dateID = dateToIso(date);
		console.log('TeamDay.constructor()', this.dateID, this.date);
		// if (this.dateID === '2022-07-01') {
		// 	throw new Error('suxx');
		// }
		if (!this.dateID) {
			throw new Error('dateID is missing');
		}
		teamID$.pipe(takeUntil(this.destroyed)).subscribe({
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
		this.subscribeForScheduleDay();
	};

	private readonly subscribeForScheduleDay = (): void => {
		if (!this.teamID) {
			return;
		}
		this.scheduleDayService
			.watchTeamDay({ id: this.teamID }, this.dateID)
			.pipe
			// takeUntil(this.destroyed),
			// takeUntil(this.teamID$),
			()
			.subscribe({
				next: (scheduleDay) => {
					const changed =
						this.scheduleDayDto != scheduleDay.dto ||
						(this.scheduleDayDto && !!scheduleDay.dto);
					this.scheduleDayDto = scheduleDay.dto;
					if (changed) {
						this.joinRecurringsWithSinglesAndEmit();
					}
				},
				error: this.errorLogger.logErrorHandler(
					'Failed to load scheduleDay record',
					{ show: false, feedback: false },
				),
			});
	};

	private readonly subscribeForSingles = (): void => {
		if (!this.teamID) {
			console.error('Tried to subscribe for single happenings without teamID');
			return;
		}
		if (!this.dateID) {
			console.error('Tried to subscribe for single happenings without dateID');
			return;
		}
		try {
			const teamID = this.teamID;
			const date = this.dateID;
			console.log(
				`TeamDay[${this.isoID}].subscribeForSingles(), teamID=${teamID}, date=${date}`,
			);
			this.happeningService
				.watchSinglesOnSpecificDay({ id: this.teamID }, this.dateID)
				.pipe(
					takeUntil(this.destroyed),
					// takeUntil(this.teamID$),
				)
				.subscribe({
					next: this.processSingles,
					error: this.errorLogger.logErrorHandler(
						`Failed to get single happenings for a given day: teamID=${teamID}, date=${date}`,
					),
				});
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
					slotID: slot.id,
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

	private subscribeForRecurrings(
		recurrings$: Observable<RecurringSlots>,
	): void {
		recurrings$.pipe(takeUntil(this.destroyed)).subscribe({
			next: this.processRecurrings,
		});
	}

	private readonly processRecurrings = (slots: RecurringSlots): void => {
		console.log(
			`TeamDay[${this.isoID},date=${this.date},wd=${
				this.wd
			}].processRecurrings(), ${
				Object.keys(slots.byWeekday).length
			} weekdays with slots:`,
			slots,
		);
		this.recurringSlots = slots;
		this.joinRecurringsWithSinglesAndEmit();
	};

	private joinRecurringsWithSinglesAndEmit(): void {
		const slots: ISlotItem[] = [];
		const weekdaySlots = this.recurringSlots?.byWeekday[this.wd]?.map(
			(wdSlot) => {
				console.log(
					'joinRecurringsWithSinglesAndEmit, wdSlot',
					this.wd,
					wdSlot,
					this.scheduleDayDto,
				);
				if (this.scheduleDayDto) {
					const adjustment = this.scheduleDayDto?.happeningAdjustments?.find(
						(a) =>
							a.happeningID === wdSlot.happening.id &&
							a.slot.id === wdSlot.slotID,
					);
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
		// 	`TeamDay[id=${this.isoID}, wd=${this.wd}].joinRecurringsWithSinglesAndEmit()`,
		// 	`${weekdaySlots?.length || 0} recurrings:`, weekdaySlots,
		// 	`${this.singles?.length || 0} singles:`, weekdaySlots,
		// 	`=> ${slots.length} slots:`, slots);
		this._slots.next(slots);
	}
}
