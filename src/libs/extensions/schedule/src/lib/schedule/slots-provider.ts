import {IRegularHappeningService, ISingleHappeningService} from 'sneat-shared/services/interfaces';
import {SlotItem, SlotsGroup, timeToStr, wd2} from '../view-models';
import {EMPTY, from, merge, Observable, Subscription} from 'rxjs';
import {localDateToIso} from 'sneat-shared/utils/datetimes';
import {ignoreElements, map, tap} from 'rxjs/operators';
import {IRxReadonlyTransaction, SelectResult} from 'rxstore';
import {Injectable} from '@angular/core';
import {Weekday} from 'sneat-shared/models/types';
import {DtoRegularActivity, DtoSingleActivity, DtoSingleTask} from 'sneat-shared/models/dto/dto-happening';
import {SneatAppSchema} from '../../../models/db-schemas-by-app';

type RegularsByWeekday = {
	[wd in Weekday]: SlotItem[] | undefined
};

export function eventToSlot(singleHappening: DtoSingleActivity | DtoSingleTask): SlotItem {
	if (!singleHappening.title) {
		throw new Error('!singleHappening.title');
	}
	// const wd = jsDayToWeekday(date.getDay());
	const singleActivity = (singleHappening as DtoSingleActivity);
	// noinspection UnnecessaryLocalVariableJS
	const slot: SlotItem = {
		kind: singleHappening.kind === 'activity' ? 'event' : 'task',
		single: singleHappening,
		title: singleHappening.title,
		time: {
			repeats: 'weekly',
			starts: timeToStr(singleHappening.dtStarts),
			ends: timeToStr(singleHappening.dtEnds),
			weekdays: [], // [wd],
		},
		participants: singleHappening.participants,
		location: singleActivity.location ? singleActivity.location : undefined,
		levels: singleActivity.levels ? singleActivity.levels : undefined,
	};
	return slot;
}

export abstract class ISlotsProvider {
	public abstract setCommuneId(communeId: string): Observable<DtoRegularActivity[]>;

	public abstract setMemberId(memberId: string): void;

	public abstract preloadEvents(tx: IRxReadonlyTransaction<SneatAppSchema> | undefined, ...dates: Date[]): Observable<SlotsGroup>;

	public abstract getDays(tx: IRxReadonlyTransaction<SneatAppSchema>, ...weekdays: SlotsGroup[]): Observable<SlotsGroup>;

	public abstract loadTodayAndFutureEvents(tx?: IRxReadonlyTransaction<SneatAppSchema>): Observable<DtoSingleActivity[]>;

}

@Injectable()
export class SlotsProvider extends ISlotsProvider {

	private communeRegularsSubscription: Subscription;

	private readonly singlesByDate: { [date: string]: SlotItem[] } = {};
	private readonly regularsByWd: RegularsByWeekday = wd2.reduce(
		(o, wd) => {
			o[wd] = undefined;
			return o;
		},
		// tslint:disable-next-line:no-object-literal-type-assertion
		{} as RegularsByWeekday,
	);

	private communeId: string;
	private memberId: string;

	constructor(
		private readonly regularService: IRegularHappeningService,
		private readonly singleService: ISingleHappeningService,
	) {
		super();
	}


	public setCommuneId(communeId: string): Observable<DtoRegularActivity[]> {
		this.communeId = communeId;
		return this.loadRegulars();
	}

	public setMemberId(memberId: string): void {
		this.memberId = memberId;
	}

	private loadRegulars(): Observable<DtoRegularActivity[]> {
		console.log('SlotsProvider.loadRegulars()');
		const $regulars = this.regularService.watchByCommuneId(this.communeId)
			.pipe(
				tap(regulars => {
					// tslint:disable-next-line:no-this-assignment
					const {regularsByWd} = this;
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
										regular,
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
		const wdRegulars = weekday.slots && weekday.slots.filter(r => r.regular);
		if (wdRegulars && wdRegulars.length === regulars.length) {
			return;
		}
		if (regulars.length) {
			weekday.slots = weekday.slots ? [
				...regulars,
				...weekday.slots.filter(r => r.kind !== 'regular-activity'),
			] : [...regulars];
		} else {
			weekday.slots = weekday.slots ? weekday.slots.filter(r => !r.regular) : [];
		}
	}

	// private addEventsToSlotsGroup(weekday: SlotsGroup, date:)

	public preloadEvents(tx: IRxReadonlyTransaction<SneatAppSchema>, ...dates: Date[]): Observable<SlotsGroup> {
		console.log('Preload events for:', dates);
		const dateKeys = dates.filter(d => !!d)
			.map(localDateToIso)
			.filter(dateKey => !this.singlesByDate[dateKey]);
		if (!dateKeys.length) {
			return EMPTY;
		}
		return this.loadEvents(tx, ...dates)
			.pipe(ignoreElements());
	}

	private loadEvents(tx: IRxReadonlyTransaction<SneatAppSchema>, ...dates: Date[]): Observable<{ dateKey: string; events: SlotItem[] }> {
		const dateISOs = dates.map(localDateToIso);

		const mapSelectResult = (selectResult: SelectResult<DtoSingleActivity>) => {
			const dateKey = selectResult.key;
			if (!dateKey) {
				throw new Error('!dateKey');
			}
			this.singlesByDate[dateKey] = selectResult.values.length ? selectResult.values.map(eventToSlot) : [];
			return {dateKey, events: this.singlesByDate[dateKey]};
		};

		return this.singleService.selectByDate(tx, this.communeId, ...dateISOs)
			.pipe(
				map(selectResult => {
					console.log(`Loaded events ${selectResult.key}: ${selectResult.values.length}`);
					return mapSelectResult(selectResult);
				}),
			);
	}

	public getDays(tx: IRxReadonlyTransaction<SneatAppSchema>, ...weekdays: SlotsGroup[]): Observable<SlotsGroup> {
		if (!this.communeId) {
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
					weekday.slots = weekday.slots.filter(slot => !slot.single);
				}
				if (weekday.slots) {
					weekday.slots = [];
				}
				// tslint:disable-next-line:no-non-null-assertion
				dateSingleSlots.forEach(slot => weekday.slots!.push(slot));
				weekdaysLoaded.push(weekday);
			} else {
				weekdaysToLoad.push(weekday);
			}
		});

		if (weekdaysToLoad.length === 0) {
			return from(weekdaysLoaded);
		}

		// tslint:disable-next-line:no-non-null-assertion
		const dates: Date[] = weekdaysToLoad.map(weekday => weekday.date!)
			.filter(date => !!date);

		const loadWeekdays$ = this.loadEvents(tx, ...dates)
			.pipe(
				map(eventSlotsByDate => {
					const weekday = weekdaysByDateKey[eventSlotsByDate.dateKey];
					if (weekday.slots) {
						weekday.slots = weekday.slots.filter(slot => !slot.single);
					}
					// tslint:disable-next-line:no-non-null-assertion
					eventSlotsByDate.events.forEach(slot => weekday.slots!.push(slot));
					return weekday;
				}),
			);

		return weekdaysLoaded ? merge(weekdaysLoaded, loadWeekdays$) : loadWeekdays$;
	}

	public loadTodayAndFutureEvents(tx: IRxReadonlyTransaction<SneatAppSchema>): Observable<DtoSingleActivity[]> {

		return this.singleService.selectFutureEvents(tx, this.communeId)
			.pipe(
				map(selectResult => {
					const processedEventIds: string[] = [];

					selectResult.values.forEach(singleHappening => {
						const {id} = singleHappening;
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
}
