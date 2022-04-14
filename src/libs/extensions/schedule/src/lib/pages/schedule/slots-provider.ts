import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SneatFirestoreService } from '@sneat/api';
import { INavContext, localDateToIso } from '@sneat/core';
import { IHappeningBrief, IRecurringHappeningDto, ISingleHappeningDto, Weekday } from '@sneat/dto';
import { ITeamContext } from '@sneat/team/models';
import { EMPTY, from, merge, Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SlotItem, Day, timeToStr, wd2 } from '../../view-models';

type RecurringsByWeekday = {
	[wd in Weekday]: SlotItem[]
};

const emptyRecurringsByWeekday = () => wd2.reduce(
	(o, wd) => {
		o[wd] = [];
		return o;
	},
	// tslint:disable-next-line:no-object-literal-type-assertion
	{} as RecurringsByWeekday,
);

export function eventToSlot(singleHappening: ISingleHappeningDto): SlotItem {
	if (!singleHappening.title) {
		throw new Error('!singleHappening.title');
	}
	// const wd = jsDayToWeekday(date.getDay());
	// noinspection UnnecessaryLocalVariableJS
	const slot: SlotItem = {
		type: singleHappening.type,
		kind: singleHappening.kind,
		single: singleHappening,
		title: singleHappening.title,
		time: {
			repeats: 'weekly',
			starts: singleHappening.dtStarts ? timeToStr(singleHappening.dtStarts) : '',
			ends: singleHappening.dtEnds ? timeToStr(singleHappening.dtEnds) : undefined,
			weekdays: [], // [wd],
		},
		participants: singleHappening.participants,
		// location: singleActivity.location ? singleActivity.location : undefined,
		levels: singleHappening.levels ? singleHappening.levels : undefined,
	};
	return slot;
}

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

// The idea fo this class is to cache loaded happenings per team
// and provide slots to UI
// @Injectable()
export class SlotsProvider /*extends ISlotsProvider*/ {

	private readonly sfsRecurrings: SneatFirestoreService<IHappeningBrief, IRecurringHappeningDto>;

	private recurringsSubscription?: Subscription;

	private readonly singlesByDate: { [date: string]: SlotItem[] } = {};
	private readonly recurringByWd: RecurringsByWeekday = emptyRecurringsByWeekday();

	private team?: ITeamContext;
	// private teamId?: string;
	private memberId?: string;

	constructor(
		afs: AngularFirestore,
		// private readonly regularService: IRegularHappeningService,
		// private readonly singleService: ISingleHappeningService,
	) {
		// super();
		this.sfsRecurrings = new SneatFirestoreService<IHappeningBrief, IRecurringHappeningDto>(
			'recurring_happenings', afs, (id: string, dto: IRecurringHappeningDto) => {
				const brief: IHappeningBrief = {
					id, ...dto,
				};
				return brief;
			},
		);
	}


	public setTeam(team: ITeamContext): void {
		console.log('SlotsProvide.setTeam()', team);
		this.team = team;
		this.processRecurringBriefs();
		// return this.loadRecurring();
	}

	public setMemberId(memberId: string): void {
		this.memberId = memberId;
	}

	public preloadEvents(...dates: Date[]): Observable<Day> {
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

	public getDays(...weekdays: Day[]): Observable<Day> {
		console.log('SlotsProvider.getDays()', weekdays);
		if (!weekdays?.length) {
			return EMPTY;
		}
		if (!this.team) {
			return from(weekdays);
		}
		const weekdaysByDateKey: { [date: string]: Day } = {};

		const weekdaysToLoad: Day[] = [];
		const weekdaysLoaded: Day[] = [];

		weekdays.forEach(weekday => {
			if (!weekday.date) {
				throw new Error('!weekday.date');
			}
			const dateKey = localDateToIso(weekday.date);
			weekdaysByDateKey[dateKey] = weekday;
			this.addRecurringsToSlotsGroup(weekday);
			const dateSingleSlots = this.singlesByDate[dateKey];
			if (dateSingleSlots) {
				if (weekday.slots) {
					weekday = { ...weekday, slots: weekday.slots.filter(slot => !slot.single) };
				}
				if (!weekday.slots) {
					weekday = { ...weekday, slots: [] };
				}
				dateSingleSlots.forEach(slot => weekday.slots && weekday.slots.push(slot));
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
						weekday = { ...weekday, slots: weekday.slots.filter(slot => !slot.single) };
					}
					eventSlotsByDate.events.forEach(slot => {
						weekday.slots && weekday.slots.push(slot);
					});
					return weekday;
				}),
			);

		return weekdaysLoaded ? merge(weekdaysLoaded, loadWeekdays$) : loadWeekdays$;
	}

	private processRecurringBriefs(): void {
		if (!this.team?.dto?.recurringHappenings) {
			return;
		}
		this.team.dto.recurringHappenings.forEach(brief => {
			this.processRecurring({ id: brief.id, brief });
		});
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
	// 					if (processedEventIds.indexOf(id) >= 0) {
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

	private watchRecurringsByTeamID(teamID: string): Observable<INavContext<IHappeningBrief, IRecurringHappeningDto>[]> {
		console.log('SlotsProvider.loadRegulars()');
		const $recurrings = this.sfsRecurrings.watchByTeamID(teamID)
			// const $regulars = this.regularService.watchByCommuneId(this.communeId)
			.pipe(
				tap(recurrings => {
					// tslint:disable-next-line:no-this-assignment
					recurrings.forEach(recurring => this.processRecurring(recurring));
				}));
		this.recurringsSubscription = $recurrings.subscribe();
		return $recurrings;
	}

	private processRecurring(recurring: INavContext<IHappeningBrief, IRecurringHappeningDto>): void {
		if (this.memberId && (!recurring.dto?.participants || !recurring?.dto.participants.find(p => p.type === 'member' && p.id === this.memberId))) {
			return;
		}
		const { recurringByWd } = this;
		Object.keys(recurringByWd)
			.forEach(wd => {
				recurringByWd[wd as Weekday] = [];
			});
		if (recurring.dto?.slots) {
			recurring.dto.slots.forEach(slot => {
				slot.time.weekdays?.forEach((wd, i) => {
					const { dto } = recurring;
					if (!dto?.title) {
						throw new Error(`!regular.title at index=${i}`);
					}
					const slotItem: SlotItem = {
						type: dto.type,
						kind: dto.kind,
						title: dto.title,
						time: slot.time,
						location: slot.location,
						levels: dto.levels,
						participants: dto.participants,
						recurring: recurring.dto,
					};
					const wdRecurrings = recurringByWd[wd];
					if (wdRecurrings) {
						wdRecurrings.push(slotItem);
					}
				});
			});
		}
	}

	private addRecurringsToSlotsGroup(weekday: Day): void {
		const recurrings = this.recurringByWd[weekday.wd];
		if (!recurrings) {
			return;
		}
		const wdRecurrings = weekday.slots && weekday.slots.filter(r => r.recurring);
		if (wdRecurrings && wdRecurrings.length === recurrings.length) {
			return;
		}
		if (recurrings.length) {
			weekday.slots = weekday.slots ? [
				...recurrings,
				...weekday.slots.filter(r => r.type !== 'recurring'),
			] : [...recurrings];
		} else {
			weekday.slots = weekday.slots ? weekday.slots.filter(r => !r.recurring) : [];
		}
	}

	private loadEvents(...dates: Date[]): Observable<{ dateKey: string; events: SlotItem[] }> {
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
