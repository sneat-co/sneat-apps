import {
	AfterViewInit,
	Component,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	OnDestroy,
	Output,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { virtualSliderAnimations } from '@sneat/components';
import { dateToIso, localDateToIso } from '@sneat/core';
import { HappeningType, IHappeningSlot, IHappeningWithUiState, WeekdayCode2 } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { IHappeningContext, IMemberContext, ITeamContext } from '@sneat/team/models';
import { Subject, takeUntil } from 'rxjs';
import { TeamDaysProvider } from '../../pages/schedule/team-days-provider';
import { ISlotItem, NewHappeningParams } from '@sneat/extensions/schedulus/shared';
import { isToday } from '../schedule-core';
import { emptyScheduleFilter, ScheduleFilterService } from '../schedule-filter.service';
import { IScheduleFilter } from '../schedule-filter/schedule-filter';
import { ScheduleFilterComponent } from '../schedule-filter/schedule-filter.component';
import { ScheduleStateService } from '../schedule-state.service';
import { Weekday } from '../schedule-week/schedule-week.component';

export type ScheduleTab = 'day' | 'week' | 'recurrings' | 'singles';

@Component({
	selector: 'sneat-schedule',
	templateUrl: './schedule.component.html',
	styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements AfterViewInit, OnChanges, OnDestroy {

	private readonly destroyed = new Subject<void>();
	private filter = emptyScheduleFilter;
	private date = new Date();
	// prevWeekdays: SlotsGroup[];
	public readonly teamDaysProvider: TeamDaysProvider;
	@ViewChild('scheduleFilterComponent') scheduleFilterComponent?: ScheduleFilterComponent;
	@Input() team?: ITeamContext;
	@Input() member?: IMemberContext;
	@Input() public tab: ScheduleTab = 'day';
	@Input() public dateID = '';
	@Output() readonly tabChanged = new EventEmitter<ScheduleTab>();
	@Output() readonly dateChanged = new EventEmitter<string>();
	public showRecurrings = true;
	public showEvents = true;
	todayAndFutureDays?: Weekday[];
	allRecurrings?: IHappeningWithUiState[];

	// private date: Date;
	recurrings?: IHappeningWithUiState[];

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly params: TeamComponentBaseParams,
		filterService: ScheduleFilterService,
		scheduleStateService: ScheduleStateService,
		afs: AngularFirestore,
	) {
		this.teamDaysProvider = new TeamDaysProvider(this.errorLogger, afs);

		filterService.filter
			.pipe(takeUntil(this.destroyed))
			.subscribe({
			next: filter => {
				this.filter = filter;
				this.recurrings = this.filterRecurrings(filter);
			},
			error: this.errorLogger.logErrorHandler('failed to get schedule filter'),
		});

		scheduleStateService.dateChanged.subscribe({
			next: changed => {
				const { date } = changed;
				this.date = date;
				this.dateID = dateToIso(date);
			},
		});

		// setTimeout(() => {
		// 	// TODO: Fix this dirty workaround for initial animations
		// 	this.setToday();
		// }, 10);
	}


	ngOnChanges(changes: SimpleChanges): void {
		if (changes['team']) {
			this.onTeamContextChanged();
		}
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
		this.teamDaysProvider.destroy();
	}

	ngAfterViewInit(): void {
		this.tabChanged.emit(this.tab);
	}

	segmentChanged(event: Event): void {
		console.log('ScheduleComponent.segmentChanged()', event);
		history.replaceState(history.state, document.title, location.href.replace(/tab=\w+/, `tab=${this.tab}`));
		switch (this.tab) {
			case 'week':
				// if (this.activeDay.date) {
				// 	this.setDay('segmentChanged', this.activeDay.date);
				// } else {
				// 	throw new Error('activeDay has no date');
				// }
				break;
			case 'singles':
				// this.slotsProvider.loadTodayAndFutureEvents(undefined)
				// 	.subscribe({
				// 		error: this.errorLogger.logError,
				// 		next: events => {
				// 			const slotGroupsByDate: { [dateKey: string]: SlotsGroup } = {};
				// 			events.forEach(event => {
				// 				const eventStartDate = new Date(event.dtStarts);
				// 				const dateKey = localDateToIso(eventStartDate);
				// 				let slotGroup = slotGroupsByDate[dateKey];
				// 				if (!slotGroup) {
				// 					const wd = 'we'; // TODO: why Wednesday?
				// 					slotGroupsByDate[dateKey] = slotGroup = {
				// 						wd,
				// 						date: eventStartDate,
				// 						title: wdCodeToWeekdayName(wd),
				// 						slots: [],
				// 					};
				// 				}
				// 				slotGroup.slots.push(eventToSlot(event));
				// 			});
				// 			this.todayAndFutureEvents = Object.values(slotGroupsByDate);
				// 		},
				// 	});
				break;
			default:
				break;
		}
	}

	onShowEventsChanged(): void {
		if (!this.showEvents) {
			this.showRecurrings = true;
		}
	}

	onShowRecurringsChanged(): void {
		if (!this.showRecurrings) {
			this.showEvents = true;
		}
	}

	// readonly goNewHappening = (params: NewHappeningParams): void => {
	// 	const { type, wd, date } = params;
	//
	// 	const state: { type?: HappeningType; date?: string; wd?: WeekdayCode2 } = { type };
	//
	// 	if (date) {
	// 		// tslint:disable-next-line:no-non-null-assertion
	// 		state.date = date;
	// 	} else if (wd) {
	// 		state.wd = wd;
	// 	} else if (this.tab === 'day') {
	// 		state.date = dateToIso(this.date);
	// 	}
	// 	if (!this.team) {
	// 		this.errorLogger.logError('!this.team');
	// 		return;
	// 	}
	// 	this.params.teamNavService
	// 		.navigateForwardToTeamPage(this.team, 'new-happening', {
	// 			queryParams: params,
	// 		})
	// 		.catch(this.errorLogger.logErrorHandler('failed to navigate to new happening page'));
	// };


	readonly onSlotClicked = (slot: ISlotItem): void => {
		console.log('ScheduleComponent.onSlotClicked()', slot);
		if (!this.team) {
			throw new Error('!team');
		}
		const happening: IHappeningContext = slot.happening;
		const page = `happening/${happening.id}`;
		this.params.teamNavService.navigateForwardToTeamPage(this.team, page, {
			state: { happening },
		}).catch(this.errorLogger.logErrorHandler('failed to navigate to recurring happening page'));
	};

	public readonly onDateSelected = (date: Date): void => {
		this.tab = 'day';
		this.setDay('onDateSelected', date);
	};

	readonly id = (i: number, v: { id: string }): string => v.id;

	readonly index = (i: number): number => i;

	// get inactiveDay(): Day {
	//     return this.activeDayParity === 'odd' ? this.evenDay : this.oddDay;
	// }

	// noinspection JSMethodCanBeStatic

	public isToday(): boolean {
		return isToday(this.date);
	}

	protected onTeamIdChanged(): void {
		if (this.team?.id) {
			// this.slotsProvider.setCommuneId(this.team.id)
			// 	.subscribe(
			// 		(regulars) => {
			// 			console.log('Loaded regulars:', regulars);
			// 			this.allRegulars = regulars;
			// 			this.regulars = this.filterRegulars();
			// 		},
			// 		this.errorLogger.logError,
			// 		() => {
			// 			// this.activeWeek.weekdays = [...this.activeWeek.weekdays];
			// 			this.setDay('onCommuneIdChanged', this.activeDay.date || new Date());
			// 		},
			// 	);
		}
	}

	private onTeamContextChanged(): void {
		if (this.team) {
			this.teamDaysProvider.setTeam(this.team);
			this.populateRecurrings();
		}
		this.setDay('onTeamDtoChanged', this.date);
	}

	// noinspection JSMethodCanBqw2se3333eStatic

	private populateRecurrings(): void {
		console.log('populateRecurrings()');
		const prevAll = this.allRecurrings;
		this.allRecurrings = this.team?.dto?.recurringHappenings?.map(brief => {
			const { id } = brief;
			const prev = prevAll?.find(p => p.id === id);
			const result: IHappeningWithUiState = { id, brief: brief, state: prev?.state || {} };
			return result;
		});
		this.recurrings = this.filterRecurrings(this.filter || emptyScheduleFilter);
	}

	// We filter recurring at schedule level, so we can share it across different components?
	private filterRecurrings(filter: IScheduleFilter): IHappeningWithUiState[] | undefined {
		const text = filter.text.toLowerCase();
		const { memberIDs, repeats, weekdays } = filter;

		const filtered = this.allRecurrings?.filter(r => {
			const { title } = r.brief;
			if (title && title.trim().toLowerCase().indexOf(text) < 0) {
				return false;
			}
			if (!this.hasMember(r.brief, memberIDs)) {
				return false;
			}
			if (!this.hasWeekday(r.brief?.slots || r.dto?.slots, weekdays)) {
				return false;
			}
			if (repeats?.length && !r.brief?.slots?.some(slot => repeats.includes(slot.repeats))) {
				return false;
			}

			return true;
		});
		console.log(`ScheduleComponent.filterRecurrings(')`, filter, this.allRecurrings, ' => ', filtered);

		return filtered;
	}

	// TODO: Decouple and reuse
	private hasMember(item: { memberIDs?: string[] } | undefined, memberIDs?: string[]): boolean {
		return !memberIDs?.length || !!item?.memberIDs?.some(id => memberIDs.includes(id));
	}

	// noinspection JSMethodCanBeStatic

	private hasWeekday(slots: IHappeningSlot[] | undefined, weekdays?: WeekdayCode2[]): boolean {
		return !weekdays || !!slots?.some(slot => slot.weekdays?.some(wd => weekdays.includes(wd)));
	}

	private setDay(source: string, d: Date): void {
		console.log(`ScheduleComponent.setDay(source=${source}), d=`, d);
		if (!d) {
			return;
		}

		// this.setSlidesAnimationState();
		//
		// this.activeDay.changeDate(d);
		//
		// this.activeWeek.activeDate = d;
		// const { tab } = this;
		// const activeWd = jsDayToWeekday(d.getDay() as wdNumber);
		// const datesToPreload: Date[] = [];
		// const datesToLoad: Day[] = [];
		// activeWeek.weekdays.forEach((weekday) => {
		// 	const weekdayDate = getWdDate(weekday.wd, activeWd, d);
		// 	if (!weekday.date || weekday.date.getTime() !== weekdayDate.getTime() || !weekday.slots) {
		// 		// console.log('weekday.date !== weekdayDate', weekday.date, weekdayDate);
		// 		weekday = { ...weekday, date: weekdayDate };
		// 		if (tab === 'week' || tab === 'day' && weekday.wd === activeWd) {
		// 			datesToLoad.push(weekday);
		// 			// tslint:disable-next-line:no-magic-numbers
		// 			const diff = tab === 'day' ? SHIFT_1_DAY : SHIFT_1_WEEK;
		// 			const wdDate = weekday.date;
		// 			if (wdDate) {
		// 				datesToPreload.push(new Date(wdDate.getFullYear(), wdDate.getMonth(), wdDate.getDate() + diff));
		// 				datesToPreload.push(new Date(wdDate.getFullYear(), wdDate.getMonth(), wdDate.getDate() - diff));
		// 			}
		// 			if (tab === 'day') {
		// 				const activeWeekDaysToPreload = activeWeek.weekdays
		// 					.filter(wd =>
		// 						!wd.date ||
		// 						// tslint:disable-next-line:no-non-null-assertion
		// 						!datesToPreload.some(dtp => dtp.getTime() === wd.date?.getTime()));
		// 				activeWeekDaysToPreload.forEach(wd => {
		// 					if (!wd.date) {
		// 						// wd.date = weekdayDate;
		// 						// this.errorLogger.logError('not implemented yet: !wd.date');
		// 						console.error('not implemented yet: !wd.date');
		// 					} else {
		// 						datesToPreload.push(wd.date);
		// 					}
		// 				});
		// 			}
		// 		}
		// 	}
		// 	if (weekday.wd === activeWd) {
		// 		this.activeDay.weekday = weekday;
		// 	}
		// });
		//
		// console.log(`segment=${tab}, datesToPreload:`, datesToPreload);
		// if (this.team) {
		// 	this.slotsProvider.getDays(...datesToLoad)
		// 		.pipe(
		// 			takeUntil(this.destroyed),
		// 		)
		// 		.subscribe({
		// 			error: this.errorLogger.logErrorHandler('failed to get days'),
		// 		});
		// }
		// this.slotsProvider.preloadEvents(tx, ...datesToPreload),

		// Change URL
		if (this.isToday()) {
			history.replaceState(history.state, document.title,
				location.href.replace(/&date=\d{4}-\d{2}-\d{2}/, ''));
		} else {
			const isoDate = `&date=${localDateToIso(d)}`;
			if (location.href.indexOf('&date') < 0) {
				history.replaceState(history.state, document.title, location.href + isoDate);
			} else {
				history.replaceState(history.state, document.title,
					location.href.replace(/&date=\d{4}-\d{2}-\d{2}/, isoDate));
			}
		}
	}

}
