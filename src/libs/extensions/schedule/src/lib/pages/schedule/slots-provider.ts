import { Injectable } from '@angular/core';
import { localDateToIso } from '@sneat/core';
import { DtoSingleActivity, IRecurringHappeningDto, ISingleHappeningDto, Weekday } from '@sneat/dto';
import { EMPTY, from, merge, Observable, Subscription } from 'rxjs';
import { ignoreElements, map, tap } from 'rxjs/operators';
import { SlotItem, SlotsGroup, timeToStr, wd2 } from '../view-models';

type RegularsByWeekday = {
	[wd in Weekday]: SlotItem[] | undefined
};

export function eventToSlot(singleHappening: ISingleHappeningDto): SlotItem {
	if (!singleHappening.title) {
		throw new Error('!singleHappening.title');
	}
	// const wd = jsDayToWeekday(date.getDay());
	// noinspection UnnecessaryLocalVariableJS
	const slot: SlotItem = {
		kind: singleHappening.kind === 'activity' ? 'event' : 'task',
		single: singleHappening,
		title: singleHappening.title,
		time: {
			repeats: 'weekly',
			starts: singleHappening.dtStarts ? timeToStr(singleHappening.dtStarts) : undefined,
			ends: singleHappening.dtEnds ? timeToStr(singleHappening.dtEnds) : undefined,
			weekdays: [], // [wd],
		},
		participants: singleHappening.participants,
		// location: singleActivity.location ? singleActivity.location : undefined,
		levels: singleHappening.levels ? singleHappening.levels : undefined,
	};
	return slot;
}

export abstract class ISlotsProvider {
	public abstract setTeamId(communeId: string): Observable<DtoRegularActivity[]>;

	public abstract setMemberId(memberId: string): void;

	public abstract preloadEvents(...dates: Date[]): Observable<SlotsGroup>;

	public abstract getDays(...weekdays: SlotsGroup[]): Observable<SlotsGroup>;

	public abstract loadTodayAndFutureEvents(): Observable<DtoSingleActivity[]>;

}

@Injectable()
export class SlotsProvider extends ISlotsProvider {

	private happeningsSubscription?: Subscription;

	private readonly singlesByDate: { [date: string]: SlotItem[] } = {};
	private readonly regularsByWd: RegularsByWeekday = wd2.reduce(
		(o, wd) => {
			o[wd] = undefined;
			return o;
		},
		// tslint:disable-next-line:no-object-literal-type-assertion
		{} as RegularsByWeekday,
	);

	private teamId?: string;
	private memberId?: string;

	constructor(
		// private readonly regularService: IRegularHappeningService,
		// private readonly singleService: ISingleHappeningService,
	) {
		super();
	}


	public setTeamId(teamId: string): Observable<DtoRegularActivity[]> {
		this.teamId = teamId;
		return this.loadRecurring();
	}

	public setMemberId(memberId: string): void {
		this.memberId = memberId;
	}

	public preloadEvents(...dates: Date[]): Observable<SlotsGroup> {
		console.log('Preload events for:', dates);
		const dateKeys = dates.filter(d => !!d)
			.map(localDateToIso)
			.filter(dateKey => !this.singlesByDate[dateKey]);
		if (!dateKeys.length) {
			return EMPTY;
		}
		return this.loadEvents(...dates)
			.pipe(ignoreElements());
	}

	public getDays(...weekdays: SlotsGroup[]): Observable<SlotsGroup> {
		if (!this.teamId) {
			return from(weekdays);
		}
		const weekdaysByDateKey: { [date: string]: SlotsGroup } = {};

		const weekdaysToLoad: SlotsGroup[] = [];
		const weekdaysLoaded: SlotsGroup[] = [];

		weekdays.forEach(weekday => {
			if (!weekday.date) {
				throw new Error('!weekday.date');
			}
			const dateKey = localDateToIso(weekday.date);
			weekdaysByDateKey[dateKey] = weekday;
			this.addRegularsToSlotsGroup(weekday);
			const dateSingleSlots = this.singlesByDate[dateKey];
			if (dateSingleSlots) {
				if (weekday.slots) {
					weekday = { ...weekday, slots: weekday.slots.filter(slot => !slot.single) };
				}
				if (weekday.slots) {
					weekday = { ...weekday, slots: [] };
				}
				dateSingleSlots.forEach(slot => weekday.slots.push(slot));
				weekdaysLoaded.push(weekday);
			} else {
				weekdaysToLoad.push(weekday);
			}
		});

		if (weekdaysToLoad.length === 0) {
			return from(weekdaysLoaded);
		}

		const dates: Date[] = weekdaysToLoad
			.map(weekday => weekday.date)
			.filter(date => !!date) as Date[];

		const loadWeekdays$ = this.loadEvents(...dates)
			.pipe(
				map(eventSlotsByDate => {
					let weekday = weekdaysByDateKey[eventSlotsByDate.dateKey];
					if (weekday.slots) {
						weekday = {...weekday, slots: weekday.slots.filter(slot => !slot.single)};
					}
					eventSlotsByDate.events.forEach(slot => {
						weekday.slots.push(slot)
					});
					return weekday;
				}),
			);

		return weekdaysLoaded ? merge(weekdaysLoaded, loadWeekdays$) : loadWeekdays$;
	}

	// private addEventsToSlotsGroup(weekday: SlotsGroup, date:)

	public loadTodayAndFutureEvents(): Observable<DtoSingleActivity[]> {

		return this.singleService.selectFutureEvents(this.teamId)
			.pipe(
				map(selectResult => {
					const processedEventIds: string[] = [];

					selectResult.values.forEach(singleHappening => {
						const { id } = singleHappening;
						if (!id) {
							throw new Error('!id');
						}
						if (processedEventIds.indexOf(id) >= 0) {
							return;
						}
						processedEventIds.push(id);
						let date = new Date(singleHappening.dtStarts);
						while (date.getTime() < singleHappening.dtEnds) {
							const dateKey = localDateToIso(date);
							let dateEvents = this.singlesByDate[dateKey];
							if (!dateEvents) {
								this.singlesByDate[dateKey] = dateEvents = [];
							}
							dateEvents.push(eventToSlot(singleHappening));
							date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
						}
					});
					return selectResult.values;
				}),
			);
	}

	private loadRecurring(): Observable<IRecurringHappeningDto[]> {
		console.log('SlotsProvider.loadRegulars()');
		const $regulars = this.regularService.watchByCommuneId(this.communeId)
			.pipe(
				tap(regulars => {
					// tslint:disable-next-line:no-this-assignment
					const { regularsByWd } = this;
					Object.keys(regularsByWd)
						.forEach(wd => {
							regularsByWd[wd as Weekday] = [];
						});
					regulars.forEach(regular => {
						if (this.memberId && (!regular.participants || !regular.participants.find(p => p.type === 'member' && p.id === this.memberId))) {
							return;
						}
						if (regular.slots) {
							regular.slots.forEach(slot => {
								slot.time.weekdays.forEach((wd, i) => {
									if (!regular.title) {
										throw new Error(`!regular.title at index=${i}`);
									}
									const slotItem: SlotItem = {
										kind: regular.kind === 'task' ? 'regular-task' : 'regular-activity',
										title: regular.title,
										time: slot.time,
										location: slot.location,
										levels: slot.levels,
										participants: regular.participants,
										recurring: regular,
									};
									// tslint:disable-next-line:no-non-null-assertion
									regularsByWd[wd]!.push(slotItem);
								});
							});
						}
					});
				}));
		this.communeRegularsSubscription = $regulars.subscribe();
		return $regulars;
	}

	private addRegularsToSlotsGroup(weekday: SlotsGroup): void {
		const regulars = this.regularsByWd[weekday.wd];
		if (!regulars) {
			return;
		}
		const wdRegulars = weekday.slots && weekday.slots.filter(r => r.recurring);
		if (wdRegulars && wdRegulars.length === regulars.length) {
			return;
		}
		if (regulars.length) {
			weekday.slots = weekday.slots ? [
				...regulars,
				...weekday.slots.filter(r => r.kind !== 'regular-activity'),
			] : [...regulars];
		} else {
			weekday.slots = weekday.slots ? weekday.slots.filter(r => !r.recurring) : [];
		}
	}

	private loadEvents(...dates: Date[]): Observable<{ dateKey: string; events: SlotItem[] }> {
		const dateISOs = dates.map(localDateToIso);

		const mapSelectResult = (selectResult: SelectResult<DtoSingleActivity>) => {
			const dateKey = selectResult.key;
			if (!dateKey) {
				throw new Error('!dateKey');
			}
			this.singlesByDate[dateKey] = selectResult.values.length ? selectResult.values.map(eventToSlot) : [];
			return { dateKey, events: this.singlesByDate[dateKey] };
		};

		// return this.singleService.selectByDate(tx, this.communeId, ...dateISOs)
		// 	.pipe(
		// 		map(selectResult => {
		// 			console.log(`Loaded events ${selectResult.key}: ${selectResult.values.length}`);
		// 			return mapSelectResult(selectResult);
		// 		}),
		// 	);
	}
}
