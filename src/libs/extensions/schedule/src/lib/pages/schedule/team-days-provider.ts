import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SneatFirestoreService } from '@sneat/api';
import { INavContext } from '@sneat/core';
import {
	happeningBriefFromDto,
	IHappeningBrief,
	IHappeningDto,
	IHappeningSlot,
	ISingleHappeningDto,
	WeekdayCode2,
} from '@sneat/dto';
import { IErrorLogger } from '@sneat/logging';
import { IHappeningContext, ITeamContext } from '@sneat/team/models';
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
import { getWd2, ISlotItem, RecurringSlots, TeamDay, timeToStr, wd2 } from '../../view-models';

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

export function happeningDtoToSlot(id: string, dto: ISingleHappeningDto): ISlotItem {
	if (!dto.title) {
		throw new Error('!singleHappening.title');
	}
	if (!dto.dtStarts) {
		throw new Error('!singleHappening.dtStarts');
	}
	const brief = happeningBriefFromDto(id, dto);
	const happening: IHappeningContext = {id, brief, dto};
	// const wd = jsDayToWeekday(date.getDay());
	// noinspection UnnecessaryLocalVariableJS
	const slot: ISlotItem = {
		happening,
		title: dto.title,
		repeats: 'once',
		timing: {
			start: {
				time: timeToStr(dto.dtStarts) || '',
			},
			end: dto.dtEnds ? {
				time: timeToStr(dto.dtEnds),
			} : undefined,
		},
		// weekdays: singleHappening.weekdays,
		participants: dto.participants,
		// location: singleActivity.location ? singleActivity.location : undefined,
		levels: dto.levels ? dto.levels : undefined,
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

const slotItemFromRecurringSlot = (r: IHappeningBrief, rs: IHappeningSlot): ISlotItem => ({
	happening: r,
	title: r.title,
	levels: r.levels,
	repeats: rs.repeats,
	timing: { start: rs.start, end: rs.end },
});

const groupRecurringSlotsByWeekday = (team?: ITeamContext): RecurringSlots => {
	const logPrefix = `teamRecurringSlotsByWeekday(team?.id=${team?.id})`;
	console.log(logPrefix + ', team:', team);
	const slots: RecurringSlots = {
		byWeekday: {},
	};
	if (!team?.dto?.recurringHappenings) {
		return slots;
	}
	team.dto.recurringHappenings.forEach(r => {
		r.slots?.forEach(rs => {
			const si: ISlotItem = slotItemFromRecurringSlot(r, rs);
			rs.weekdays?.forEach(wd => {
				let weekday = slots.byWeekday[wd];
				if (!weekday) {
					weekday = [];
					slots.byWeekday[wd] = weekday;
				}
				weekday.push(si);
			});
		});
	});
	return slots;
};

// @Injectable()
export class TeamDaysProvider /*extends ISlotsProvider*/ {
	// At the moment tracks schedule of a single team
	// but probably will track multiple teams at once.

	private readonly sfsRecurrings: SneatFirestoreService<IHappeningBrief, IHappeningDto>;
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
		shareReplay(1),
		tap(slots => console.log('TeamDaysProvider.recurrings$ =>', slots)),
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
		private readonly afs: AngularFirestore,
		// private readonly regularService: IRegularHappeningService,
		// private readonly singleService: ISingleHappeningService,
	) {
		console.log('TeamDaysProvider.constructor()');
		// super();
		this.sfsRecurrings = new SneatFirestoreService<IHappeningBrief, IHappeningDto>(
			'recurring_happenings', afs, (id: string, dto: IHappeningDto) => {
				const brief: IHappeningBrief = {
					id, ...dto,
				};
				return brief;
			},
		);
	}

	public destroy(): void {
		this.destroyed.next();
		Object.entries(this.days).forEach(([wd, dsp]) => {
			dsp.destroy();
		});
	}

	public getTeamDay(date: Date): TeamDay {
		const id = getWd2(date);
		let day = this.days[id];
		if (!day) {
			this.days[id] = day = new TeamDay(this.teamID$, date, this.recurrings$, this.errorLogger, this.afs);
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
		//

	}

	private processRecurringBriefs(): void {
		if (!this._team?.dto?.recurringHappenings) {
			return;
		}
		this._team.dto.recurringHappenings.forEach(brief => {
			this.processRecurring({ id: brief.id, brief });
		});
	}

	private watchRecurringsByTeamID(teamID: string): Observable<INavContext<IHappeningBrief, IHappeningDto>[]> {
		console.log('TeamDaysProvider.loadRegulars()');
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

	private processRecurring(recurring: INavContext<IHappeningBrief, IHappeningDto>): void {
		if (this.memberId && (!recurring.dto?.participants || !recurring?.dto.participants.find(p => p.type === 'member' && p.id === this.memberId))) {
			return;
		}
		const { recurringByWd } = this;
		Object.keys(recurringByWd)
			.forEach(wd => {
				recurringByWd[wd as WeekdayCode2] = [];
			});
		if (recurring.dto?.slots) {
			recurring.dto.slots.forEach(slot => {
				slot.weekdays?.forEach((wd, i) => {
					const { dto } = recurring;
					if (!dto?.title) {
						throw new Error(`!regular.title at index=${i}`);
					}
					if (!recurring.brief) {
						throw new Error('recurring context has no brief');
					}
					const slotItem: ISlotItem = {
						happening: recurring,
						title: dto.title,
						repeats: slot.repeats,
						timing: { start: slot.start, end: slot.end },
						location: slot.location,
						levels: dto.levels,
						participants: dto.participants,
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
