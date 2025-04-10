import { computed, Signal, signal } from '@angular/core';
import { dateToIso } from '@sneat/core';
import { CalendariumSpaceService } from '../services/calendarium-space.service';
import {
	IHappeningBrief,
	IHappeningDbo,
	ISlotUIContext,
} from '@sneat/mod-schedulus-core';
import { IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/space-models';
import { ModuleSpaceItemService } from '@sneat/space-services';
import { EMPTY, Observable, Subject } from 'rxjs';
import { CalendarDay, ICalendarDayInput } from './calendar-day';
import { CalendarSpace } from './calendar-space';
import { HappeningService } from './happening.service';
import { CalendarDayService } from './calendar-day.service';

// export function happeningDtoToSlot(id: string, dto: ISingleHappeningDto): ISlotItem {
// 	if (!dto.title) {
// 		throw new Error('!singleHappening.title');
// 	}
// 	if (!dto.dtStarts) {
// 		throw new Error('!singleHappening.dtStarts');
// 	}
// 	const brief = happeningBriefFromDto(id, dto);
// 	const happening: IHappeningContext = { id, brief, dto };
// 	// const wd = jsDayToWeekday(date.getDay());
// 	// noinspection UnnecessaryLocalVariableJS
// 	const slot: ISlotItem = {
// 		happening,
// 		title: dto.title,
// 		repeats: 'once',
// 		timing: {
// 			start: {
// 				time: timeToStr(dto.dtStarts) || '',
// 			},
// 			end: dto.dtEnds ? {
// 				time: timeToStr(dto.dtEnds),
// 			} : undefined,
// 		},
// 		// weekdays: singleHappening.weekdays,
// 		participants: dto.participants,
// 		// location: singleActivity.location ? singleActivity.location : undefined,
// 		levels: dto.levels ? dto.levels : undefined,
// 	};
// 	return slot;
// }

// export abstract class ISlotsProvider {
// 	// public abstract setTeamId(communeId: string): Observable<DtoRegularActivity[]>;
//
// 	public abstract setMemberId(memberId: string): void;
//
// 	public abstract preloadEvents(...dates: Date[]): Observable<SlotsGroup>;
//
// 	public abstract getDays(...weekdays: SlotsGroup[]): Observable<SlotsGroup>;
//
// 	// public abstract loadTodayAndFutureEvents(): Observable<DtoSingleActivity[]>;
// }

export class CalendarDaysProvider {
	/*implements OnDestroy - this is not a component, do not implement ngOnDestroy(), instead call destroy() */
	/*extends ISlotsProvider*/
	// At the moment tracks schedule of a single team
	// but probably will track multiple teams at once.

	private readonly destroyed = new Subject<void>();

	private readonly recurringsSpaceItemService?: ModuleSpaceItemService<
		IHappeningBrief,
		IHappeningDbo
	>;
	// private readonly singlesByDate: Record<string, ISlotUIContext[]> = {};

	private readonly $space = signal<ISpaceContext | undefined>(undefined);

	private readonly days: Record<string, CalendarDay> = {};

	private contactID?: string; // TODO: should be {readonly spaceID: string; readonly contactID: string}

	constructor(
		private readonly $primarySpaceID: Signal<string | undefined>,
		private readonly errorLogger: IErrorLogger,
		private readonly happeningService: HappeningService,
		private readonly calendarDayService: CalendarDayService,
		private readonly calendariumSpaceService: CalendariumSpaceService,
		// sneatApiService: SneatApiService,
		// private readonly regularService: IRegularHappeningService,
		// private readonly singleService: ISingleHappeningService,
	) {
		console.log('SpaceDaysProvider.constructor()');
		// this.recurringsSpaceItemService = new ModuleSpaceItemService(
		// 	'calendarium',
		// 	'recurring_happenings', // TODO: Is this obsolete? Should we use 'happenings' instead?
		// 	calendarDayService.afs,
		// 	undefined as SneatApiService,
		// );
	}

	private primarySpace?: CalendarSpace;

	private $primarySpace = computed<CalendarSpace | undefined>(() => {
		const newSpaceID = this.$primarySpaceID();
		if (this.primarySpace?.spaceID === newSpaceID) {
			return this.primarySpace;
		}
		this.primarySpace?.destroy();
		if (this.primarySpace?.spaceID == newSpaceID) {
			return this.primarySpace;
		}
		this.primarySpace = newSpaceID
			? new CalendarSpace(newSpaceID, this.calendariumSpaceService)
			: undefined;
		return this.primarySpace;
	});

	private $spaces = computed<readonly CalendarSpace[]>(() => {
		const primarySpace = this.$primarySpace();
		return primarySpace ? [primarySpace] : [];
	});

	public destroy(): void {
		this.destroyed.next();
		Object.values(this.days).forEach((day) => {
			day.destroy();
		});
		this.$spaces().forEach((space) => space.destroy());
	}

	public readonly $spaceIDs = computed(() =>
		this.$spaces().map((input) => input.spaceID),
	);

	private readonly $inputs = computed<readonly ICalendarDayInput[]>(() =>
		this.$spaces().map((space) => ({
			spaceID: space.spaceID,
			recurrings$: space.recurrings$,
		})),
	);

	public getCalendarDay(date: Date): CalendarDay {
		const id = dateToIso(date);
		let day = this.days[id];
		if (!day) {
			day = new CalendarDay(
				date,
				this.$inputs,
				this.errorLogger,
				this.happeningService,
				this.calendarDayService,
			);
			this.days[id] = day;
		}
		return day;
	}

	public setMemberId(memberId: string): void {
		this.contactID = memberId;
	}

	public preloadEvents(...dates: Date[]): Observable<CalendarDay> {
		console.warn('not implemented: Preload events for:', dates);
		return EMPTY;
		// const dateKeys = dates.filter(d => !!d)
		// 	.map(localDateToIso)
		// 	.filter(dateKey => !this.singlesByDate[dateKey]);
		// if (!dateKeys.length) {
		// 	return EMPTY;
		// }
		// return this.loadEvents(...dates)
		// 	.pipe(ignoreElements());
	}

	public getDays(...weekdays: CalendarDay[]): Observable<CalendarDay> {
		console.log('SpaceDaysProvider.getDays()', weekdays);
		return EMPTY;
		// if (!weekdays?.length) {
		// 	return EMPTY;
		// }
		// if (!this.team) {
		// 	return from(weekdays);
		// }
		// const weekdaysByDateKey: { [date: string]: Day } = {};
		//
		// const weekdaysToLoad: Day[] = [];
		// const weekdaysLoaded: Day[] = [];
		//
		// weekdays.forEach(weekday => {
		// 	if (!weekday.date) {
		// 		throw new Error('!weekday.date');
		// 	}
		// 	const dateKey = localDateToIso(weekday.date);
		// 	weekdaysByDateKey[dateKey] = weekday;
		// 	this.addRecurringsToSlotsGroup(weekday);
		// 	const dateSingleSlots = this.singlesByDate[dateKey];
		// 	if (dateSingleSlots) {
		// 		if (weekday.slots) {
		// 			weekday = { ...weekday, slots: weekday.slots.filter(slot => !slot.single) };
		// 		}
		// 		if (!weekday.slots) {
		// 			weekday = { ...weekday, slots: [] };
		// 		}
		// 		dateSingleSlots.forEach(slot => weekday.slots && weekday.slots.push(slot));
		// 		weekdaysLoaded.push(weekday);
		// 	} else {
		// 		weekdaysToLoad.push(weekday);
		// 	}
		// });
		//
		// if (weekdaysToLoad.length === 0) {
		// 	return from(weekdaysLoaded);
		// }
		//
		// const dates: Date[] = weekdaysToLoad
		// 	.map(weekday => weekday.date)
		// 	.filter(date => !!date) as Date[];
		//
		// const loadWeekdays$ = this.loadEvents(...dates)
		// 	.pipe(
		// 		map(eventSlotsByDate => {
		// 			let weekday = weekdaysByDateKey[eventSlotsByDate.dateKey];
		// 			if (weekday.slots) {
		// 				weekday = { ...weekday, slots: weekday.slots.filter(slot => !slot.single) };
		// 			}
		// 			eventSlotsByDate.events.forEach(slot => {
		// 				weekday.slots && weekday.slots.push(slot);
		// 			});
		// 			return weekday;
		// 		}),
		// 	);
		//
		// return weekdaysLoaded ? merge(weekdaysLoaded, loadWeekdays$) : loadWeekdays$;
	}

	public loadForWeek(d: Date): void {
		console.log('SpaceDaysProvider.loadForWeek()', d);
	}

	// private addEventsToSlotsGroup(weekday: SlotsGroup, date:)

	// public loadTodayAndFutureEvents(): Observable<DtoSingleActivity[]> {
	//
	// 	return this.singleService.selectFutureEvents(this.teamId)
	// 		.pipe(
	// 			map(selectResult => {
	// 				const processedEventIds: string[] = [];
	//
	// 				selectResult.values.forEach(singleHappening => {
	// 					const { id } = singleHappening;
	// 					if (!id) {
	// 						throw new Error('!id');
	// 					}
	// 					if (processedEventIds.includes(id)) {
	// 						return;
	// 					}
	// 					processedEventIds.push(id);
	// 					let date = new Date(singleHappening.dtStarts);
	// 					while (date.getTime() < singleHappening.dtEnds) {
	// 						const dateKey = localDateToIso(date);
	// 						let dateEvents = this.singlesByDate[dateKey];
	// 						if (!dateEvents) {
	// 							this.singlesByDate[dateKey] = dateEvents = [];
	// 						}
	// 						dateEvents.push(eventToSlot(singleHappening));
	// 						date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
	// 					}
	// 				});
	// 				return selectResult.values;
	// 			}),
	// 		);
	// }

	private loadEvents(
		...dates: Date[]
	): Observable<{ dateKey: string; events: ISlotUIContext[] }> {
		console.log('loadEvents()', dates);
		return EMPTY;
		// const dateISOs = dates.map(localDateToIso);
		//
		// const mapSelectResult = (selectResult: SelectResult<DtoSingleActivity>) => {
		// 	const dateKey = selectResult.key;
		// 	if (!dateKey) {
		// 		throw new Error('!dateKey');
		// 	}
		// 	this.singlesByDate[dateKey] = selectResult.values.length ? selectResult.values.map(eventToSlot) : [];
		// 	return { dateKey, events: this.singlesByDate[dateKey] };
		// };

		// return this.singleService.selectByDate(tx, this.communeId, ...dateISOs)
		// 	.pipe(
		// 		map(selectResult => {
		// 			console.log(`Loaded events ${selectResult.key}: ${selectResult.values.length}`);
		// 			return mapSelectResult(selectResult);
		// 		}),
		// 	);
	}
}
