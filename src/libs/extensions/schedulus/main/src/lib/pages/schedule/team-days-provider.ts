import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SneatApiService } from '@sneat/api';
import { dateToIso, INavContext } from '@sneat/core';
import { IHappeningBrief, IHappeningDto, IHappeningSlot, WeekdayCode2 } from '@sneat/dto';
import { ISlotItem, RecurringSlots, TeamDay, wd2 } from '@sneat/extensions/schedulus/shared';
import { IErrorLogger } from '@sneat/logging';
import { IHappeningContext, ITeamContext, ITeamItemContext } from '@sneat/team/models';
import { HappeningService, ScheduleDayService, TeamItemService } from '@sneat/team/services';
import {
	BehaviorSubject,
	distinctUntilChanged,
	EMPTY,
	map,
	Observable,
	shareReplay,
	Subject,
	Subscription,
} from 'rxjs';
import { tap } from 'rxjs/operators';

type RecurringsByWeekday = {
	[wd in WeekdayCode2]: ISlotItem[]
};

const emptyRecurringsByWeekday = () => wd2.reduce(
	(o, wd) => {
		o[wd] = [];
		return o;
	},
	// tslint:disable-next-line:no-object-literal-type-assertion
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

const slotItemsFromRecurringSlot = (r: IHappeningContext, rs: IHappeningSlot): ISlotItem[] => {
	const si = {
		// date: rs.start.date,
		slotID: rs.id,
		happening: r,
		title: r.brief?.title || r.id,
		levels: r.brief?.levels,
		repeats: rs.repeats,
		timing: { start: rs.start, end: rs.end },
	};
	if (rs.weekdays?.length) {
		return rs.weekdays.map(wd => ({ ...si, wd }));
	}
	return [si];
};

const groupRecurringSlotsByWeekday = (team?: ITeamContext): RecurringSlots => {
	const logPrefix = `teamRecurringSlotsByWeekday(team?.id=${team?.id})`;
	const slots: RecurringSlots = {
		byWeekday: {},
	};
	if (!team?.dto?.recurringHappenings) {
		console.log(logPrefix + ', no slots for team:', team);
		return slots;
	}
	team.dto.recurringHappenings.forEach(brief => {
		brief.slots?.forEach(rs => {
			const happening: IHappeningContext = { id: brief.id, brief, team};
			const slotItems: ISlotItem[] = slotItemsFromRecurringSlot(happening, rs);
			slotItems.forEach(si => {
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
export class TeamDaysProvider /*extends ISlotsProvider*/ {
	// At the moment tracks schedule of a single team
	// but probably will track multiple teams at once.

	private readonly recurringsTeamItemService: TeamItemService<IHappeningBrief, IHappeningDto>;
	private readonly singlesByDate: { [date: string]: ISlotItem[] } = {};
	private readonly recurringByWd: RecurringsByWeekday = emptyRecurringsByWeekday();
	private readonly team$ = new BehaviorSubject<ITeamContext | undefined>(undefined);
	private readonly teamID$ = this.team$.asObservable().pipe(
		map(team => team?.id),
		distinctUntilChanged(),
	);
	private readonly days: { [d: string]: TeamDay } = {};
	private readonly destroyed = new Subject<void>();
	private readonly recurrings$: Observable<RecurringSlots> = this.team$.pipe(
		// TODO: Instead of providing all slots we can provide observables of slots for a specific day
		// That would minimize number of handlers to be called on watching components
		// Tough it's a micro optimization that does not seems to worth the effort now.
		map(groupRecurringSlotsByWeekday),
		tap(slots => console.log('TeamDaysProvider.recurrings$ =>', slots)),
		shareReplay(1),
	);
	private recurringsSubscription?: Subscription;
	// private teamId?: string;
	private memberId?: string;

	private _team?: ITeamContext;

	public get team(): ITeamContext | undefined {
		return this._team;
	}

	constructor(
		private readonly errorLogger: IErrorLogger,
		private readonly happeningService: HappeningService,
		private readonly scheduleDayService: ScheduleDayService,
		afs: AngularFirestore,
		sneatApiService: SneatApiService,
		// private readonly regularService: IRegularHappeningService,
		// private readonly singleService: ISingleHappeningService,
	) {
		console.log('TeamDaysProvider.constructor()');
		// super();
		this.recurringsTeamItemService = new TeamItemService<IHappeningBrief, IHappeningDto>(
			'recurring_happenings', afs, sneatApiService,
		);
	}

	public destroy(): void {
		this.destroyed.next();
		Object.entries(this.days).forEach(([, dsp]) => {
			dsp.destroy();
		});
	}

	public getTeamDay(date: Date): TeamDay {
		const id = dateToIso(date);
		let day = this.days[id];
		if (!day) {
			this.days[id] = day = new TeamDay(
				this.teamID$, date, this.recurrings$, this.errorLogger,
				this.happeningService, this.scheduleDayService);
		}
		return day;
	}

	public setTeam(team: ITeamContext): void {
		console.log('SlotsProvide.setTeam()', team);
		this._team = team;
		this.team$.next(team);
		this.processRecurringBriefs();
		// return this.loadRecurring();
	}

	public setMemberId(memberId: string): void {
		this.memberId = memberId;
	}

	public preloadEvents(...dates: Date[]): Observable<TeamDay> {
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

	public getDays(...weekdays: TeamDay[]): Observable<TeamDay> {
		console.log('TeamDaysProvider.getDays()', weekdays);
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
		console.log('TeamDaysProvider.loadForWeek()', d);

	}

	private processRecurringBriefs(): void {
		if (!this._team?.dto?.recurringHappenings) {
			return;
		}
		this._team.dto.recurringHappenings.forEach(brief => {
			this.processRecurring({ id: brief.id, brief, team: this._team || {id: ''} });
		});
	}

	private watchRecurringsByTeamID(team: ITeamContext): Observable<INavContext<IHappeningBrief, IHappeningDto>[]> {
		console.log('TeamDaysProvider.loadRegulars()');
		const $recurrings = this.recurringsTeamItemService.watchTeamItems(team)
			// const $regulars = this.regularService.watchByCommuneId(this.communeId)
			.pipe(
				tap(recurrings => {
					// tslint:disable-next-line:no-this-assignment
					recurrings.forEach(recurring => this.processRecurring(recurring));
				}));
		this.recurringsSubscription = $recurrings.subscribe();
		return $recurrings;
	}

	private processRecurring(recurring: ITeamItemContext<IHappeningBrief, IHappeningDto>): void {
		if (this.memberId && (!recurring.dto?.participants || !recurring?.dto.participants.find(p => p.type === 'member' && p.id === this.memberId))) {
			return;
		}
		console.log('processRecurring()', recurring);
		const { recurringByWd } = this;
		Object.keys(recurringByWd)
			.forEach(wd => {
				recurringByWd[wd as WeekdayCode2] = [];
			});
		if (recurring.brief?.slots) {
			recurring.brief.slots.forEach(slot => {
				slot.weekdays?.forEach((wd, i) => {
					const { brief } = recurring;
					if (!brief) {
						throw new Error('recurring context has no brief');
					}
					if (!brief.title) {
						throw new Error(`!brief.title at index=${i}`);
					}
					if (slot.repeats === 'weekly' && !wd) {
						throw new Error(`slot.repeats === 'weekly' && !wd=${wd}`);
					}
					const slotItem: ISlotItem = {
						slotID: slot.id,
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

	private addRecurringsToSlotsGroup(weekday: TeamDay): void {
		const recurrings = this.recurringByWd[weekday.wd];
		if (!recurrings) {
			return;
		}
		const wdRecurrings = weekday.slots && weekday.slots.filter(r => r.happening.brief?.type === 'recurring');
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

	private loadEvents(...dates: Date[]): Observable<{ dateKey: string; events: ISlotItem[] }> {
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
