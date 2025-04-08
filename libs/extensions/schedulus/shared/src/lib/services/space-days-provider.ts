import { computed, signal } from '@angular/core';
import { SneatApiService } from '@sneat/api';
import { dateToIso, INavContext } from '@sneat/core';
import { hasRelated } from '@sneat/dto';
import {
	IHappeningBrief,
	IHappeningDbo,
	IHappeningSlot,
	WeekdayCode2,
	IHappeningContext,
	ICalendariumSpaceDbo,
	ISchedulusSpaceContext,
	ISlotUIContext,
	RecurringSlots,
} from '@sneat/mod-schedulus-core';
import { IErrorLogger } from '@sneat/logging';
import {
	ISpaceContext,
	ISpaceItemNavContext,
	ISpaceItemWithOptionalDbo,
	zipMapBriefsWithIDs,
} from '@sneat/space-models';
import { ModuleSpaceItemService } from '@sneat/space-services';
import {
	BehaviorSubject,
	EMPTY,
	filter,
	map,
	Observable,
	shareReplay,
	skip,
	Subject,
	takeUntil,
} from 'rxjs';
import { tap } from 'rxjs/operators';
import { SpaceDay } from './space-day';
import { HappeningService } from './happening.service';
import { CalendarDayService } from './calendar-day.service';

type RecurringsByWeekday = {
	[wd in WeekdayCode2]: ISlotUIContext[];
};

const emptyRecurringsByWeekday = () =>
	(['mo', 'tu', 'we', 'th', 'fr', 'sa', 'su'] as WeekdayCode2[]).reduce(
		(o, wd) => {
			o[wd] = [];
			return o;
		},
		{} as RecurringsByWeekday,
	);

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

const slotUIContextsFromRecurringSlot = (
	r: IHappeningContext,
	slotID: string,
	rs: IHappeningSlot,
): ISlotUIContext[] => {
	const si = {
		// date: rs.start.date,
		slot: { ...rs, id: slotID },
		happening: r,
		title: r.brief?.title || r.id,
		levels: r.brief?.levels,
		repeats: rs.repeats,
		timing: { start: rs.start, end: rs.end },
	};
	if (rs.weekdays?.length) {
		return rs.weekdays.map((wd) => ({ ...si, wd }));
	}
	return [si];
};

const groupRecurringSlotsByWeekday = (
	schedulusTeam?: ISchedulusSpaceContext,
): RecurringSlots => {
	const logPrefix = `teamRecurringSlotsByWeekday(team?.id=${schedulusTeam?.id})`;
	const slots: RecurringSlots = {
		byWeekday: {},
	};
	if (!schedulusTeam?.dbo?.recurringHappenings) {
		console.log(logPrefix + ', no slots for team:', schedulusTeam);
		return slots;
	}
	zipMapBriefsWithIDs(schedulusTeam.dbo.recurringHappenings).forEach((rh) => {
		Object.entries(rh.brief.slots || {})?.forEach(([slotID, rs]) => {
			const happening: IHappeningContext = {
				id: rh.id,
				brief: rh.brief,
				space: schedulusTeam.space,
			};
			const slotItems = slotUIContextsFromRecurringSlot(happening, slotID, rs);
			slotItems.forEach((si) => {
				if (si.wd) {
					let weekday = slots.byWeekday[si.wd];
					if (!weekday) {
						weekday = [];
						slots.byWeekday[si.wd] = weekday;
					}
					weekday.push(si);
				}
			});
		});
	});
	console.log(logPrefix + ', slots:', slots);
	return slots;
};

// @Injectable()
export class SpaceDaysProvider {
	/*implements OnDestroy - this is not a component, do not implement ngOnDestroy(), instead call destroy() */
	/*extends ISlotsProvider*/
	// At the moment tracks schedule of a single team
	// but probably will track multiple teams at once.

	private readonly destroyed = new Subject<void>();

	private readonly recurringsSpaceItemService: ModuleSpaceItemService<
		IHappeningBrief,
		IHappeningDbo
	>;
	// private readonly singlesByDate: Record<string, ISlotUIContext[]> = {};
	private readonly recurringByWd: RecurringsByWeekday =
		emptyRecurringsByWeekday();

	private readonly $space = signal<ISpaceContext | undefined>(undefined);

	private readonly $spaceID = computed(() => this.$space()?.id || '');

	private readonly space$ = new BehaviorSubject<ISpaceContext | undefined>(
		undefined,
	);

	private readonly schedulusSpace$ = new BehaviorSubject<
		ISchedulusSpaceContext | undefined
	>(undefined);

	private readonly days: Record<string, SpaceDay> = {};

	private readonly recurrings$: Observable<RecurringSlots> =
		this.schedulusSpace$.pipe(
			skip(1), // We are not interested in processing the first 'undefined' value of BehaviorSubject
			filter((schedulusSpace) => !!schedulusSpace), // Not sure if we need this.
			// TODO: Instead of providing all slots we can provide observables of slots for a specific day
			// That would minimize number of handlers to be called on watching components
			map((schedulusSpace) => groupRecurringSlotsByWeekday(schedulusSpace)),
			tap((slots) => console.log('SpaceDaysProvider.recurrings$ =>', slots)),
			shareReplay(1),
		);

	// private teamId?: string;
	private memberId?: string;

	constructor(
		private readonly errorLogger: IErrorLogger,
		private readonly happeningService: HappeningService,
		private readonly calendarDayService: CalendarDayService,
		sneatApiService: SneatApiService,
		// private readonly regularService: IRegularHappeningService,
		// private readonly singleService: ISingleHappeningService,
	) {
		console.log('SpaceDaysProvider.constructor()');
		// super();
		this.recurringsSpaceItemService = new ModuleSpaceItemService(
			'calendarium',
			'recurring_happenings', // TODO: Is this obsolete? Should we use 'happenings' instead?
			calendarDayService.afs,
			sneatApiService,
		);
	}

	public destroy(): void {
		this.destroyed.next();
		Object.values(this.days).forEach((day) => {
			day.destroy();
		});
	}

	public getSpaceDay(date: Date): SpaceDay {
		const id = dateToIso(date);
		let day = this.days[id];
		if (!day) {
			day = new SpaceDay(
				this.$spaceID(),
				date,
				this.recurrings$,
				this.errorLogger,
				this.happeningService,
				this.calendarDayService,
			);
			this.days[id] = day;
		}
		return day;
	}

	public setSpace(space: ISpaceContext): void {
		console.log('SpaceDaysProvider.setSpace()', space);
		this.$space.set(space);
		// this.processRecurringBriefs();
		// return this.loadRecurring();
	}

	public setSchedulusSpace(
		schedulusSpace: ISpaceItemWithOptionalDbo<ICalendariumSpaceDbo>,
	): void {
		console.log('SpaceDaysProvider.setSchedulusSpace()', schedulusSpace);
		// if (schedulusTeam.id !== this._team?.id) {
		//   throw new Error(
		//     `schedulusTeam.id=${schedulusTeam.id} !== this._team?.id=${this._team?.id}`,
		//   );
		// }
		this.schedulusSpace$.next(schedulusSpace);
		this.processRecurringBriefs();
	}

	public setMemberId(memberId: string): void {
		this.memberId = memberId;
	}

	public preloadEvents(...dates: Date[]): Observable<SpaceDay> {
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

	public getDays(...weekdays: SpaceDay[]): Observable<SpaceDay> {
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

	private processRecurringBriefs(): void {
		console.log(
			'SpaceDaysProvider.processRecurringBriefs()',
			this.schedulusSpace$.value,
		);
		if (!this.schedulusSpace$.value?.dbo?.recurringHappenings) {
			return;
		}
		const space = this.$space();
		zipMapBriefsWithIDs(
			this.schedulusSpace$.value?.dbo?.recurringHappenings,
		).forEach((rh) => {
			this.processRecurring({
				id: rh.id,
				brief: rh.brief,
				space: space || { id: '' },
			});
		});
	}

	private watchRecurringsBySpaceID(
		space: ISpaceContext,
	): Observable<INavContext<IHappeningBrief, IHappeningDbo>[]> {
		console.log('SpaceDaysProvider.loadRegulars()');
		const $recurrings = this.recurringsSpaceItemService
			.watchModuleSpaceItemsWithSpaceRef(space)
			// const $regulars = this.regularService.watchByCommuneId(this.communeId)
			.pipe(
				takeUntil(this.destroyed),
				tap((recurrings) => {
					recurrings.forEach((recurring) => this.processRecurring(recurring));
				}),
			);
		return $recurrings;
	}

	private processRecurring(
		recurring: ISpaceItemNavContext<IHappeningBrief, IHappeningDbo>,
	): void {
		const spaceID = this.$spaceID();
		if (!spaceID) {
			return;
		}
		if (
			this.memberId &&
			hasRelated(
				recurring.dbo?.related || recurring?.brief?.related,
				'contactus',
				'contacts',
				{ spaceID, itemID: this.memberId },
			)
		) {
			return;
		}
		console.log('SpaceDaysProvider.processRecurring()', recurring);
		const { recurringByWd } = this;
		Object.keys(recurringByWd).forEach((wd) => {
			recurringByWd[wd as WeekdayCode2] = [];
		});
		const { brief } = recurring;
		if (!brief) {
			throw new Error('recurring context has no brief');
		}
		if (!brief.title) {
			throw new Error(`!brief.title`);
		}
		if (brief.slots) {
			Object.entries(brief.slots).forEach(([slotID, slot]) => {
				slot.weekdays?.forEach((wd) => {
					if (slot.repeats === 'weekly' && !wd) {
						throw new Error(`slot.repeats === 'weekly' && !wd=${wd}`);
					}
					const slotItem: ISlotUIContext = {
						slot: { ...slot, id: slotID },
						wd: wd,
						happening: recurring,
						title: brief.title,
						repeats: slot.repeats,
						timing: { start: slot.start, end: slot.end },
						location: slot.location,
						levels: brief.levels,
						// participants: dto.participants,
					};
					const wdRecurrings = recurringByWd[wd];
					if (wdRecurrings) {
						wdRecurrings.push(slotItem);
					}
				});
			});
		}
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

	private addRecurringsToSlotsGroup(weekday: SpaceDay): void {
		const recurrings = this.recurringByWd[weekday.wd];
		if (!recurrings) {
			return;
		}
		const wdRecurrings =
			weekday.slots &&
			weekday.slots.filter((r) => r.happening.brief?.type === 'recurring');
		if (wdRecurrings && wdRecurrings.length === recurrings.length) {
			return;
		}
		if (recurrings.length) {
			// weekday.slots = weekday.slots ? [
			// 	...recurrings,
			// 	...weekday.slots.filter(r => r.type !== 'recurring'),
			// ] : [...recurrings];
		} else {
			// weekday.slots = weekday.slots ? weekday.slots.filter(r => !r.recurring) : [];
		}
	}

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
