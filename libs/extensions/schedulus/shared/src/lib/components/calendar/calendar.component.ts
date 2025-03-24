import {
	AfterViewInit,
	Component,
	EventEmitter,
	Inject,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	SimpleChanges,
	ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SneatApiService } from '@sneat/api';
import { IMemberContext } from '@sneat/contactus-core';
import { dateToIso, localDateToIso } from '@sneat/core';
import {
	IHappeningSlot,
	WeekdayCode2,
	IHappeningWithUiState,
} from '@sneat/mod-schedulus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { SpaceComponentBaseParams } from '@sneat/team-components';
import { ISpaceContext } from '@sneat/team-models';
import { takeUntil } from 'rxjs';
import { CalendarDayService } from '../../services/calendar-day.service';
import { CalendariumSpaceService } from '../../services/calendarium-space.service';
import { HappeningService } from '../../services/happening.service';
import { isToday } from '../schedule-core';
import {
	emptyCalendarFilter,
	CalendarFilterService,
} from '../calendar-filter.service';
import { hasContact } from '../schedule-slots';
import { CalendarBaseComponent } from './calendar-base.component';
import { CalendarTab } from './calendar-component-types';
import { CalendarDayTabComponent } from './components/calendar-day/calendar-day-tab.component';
import { ICalendarFilter } from './components/calendar-filter/calendar-filter';
import { CalendarFilterComponent } from './components/calendar-filter/calendar-filter.component';

import { CalendarStateService } from './calendar-state.service';
import { CalendarWeekTabComponent } from './components/calendar-week/calendar-week-tab.component';
import { RecurringsTabComponent } from './components/recurrings-tab/recurrings-tab.component';
import { SinglesTabComponent } from './components/singles-tab/singles-tab.component';

@Component({
	selector: 'sneat-calendar',
	templateUrl: './calendar.component.html',
	styleUrls: ['./calendar.component.scss'],
	imports: [
		IonicModule,
		SinglesTabComponent,
		RecurringsTabComponent,
		CalendarWeekTabComponent,
		CalendarDayTabComponent,
		CalendarFilterComponent,
		FormsModule,
	],
})
export class CalendarComponent
	extends CalendarBaseComponent
	implements OnInit, AfterViewInit, OnChanges, OnDestroy
{
	private filter = emptyCalendarFilter;

	// prevWeekdays: SlotsGroup[];

	@ViewChild('calendarFilterComponent')
	public calendarFilterComponent?: CalendarFilterComponent;

	// @Input()
	// set space(space: ISpaceContext) {
	// 	console.log('CalendarComponent.space=', space);
	// 	this._space = space;
	// }

	@Input() member?: IMemberContext;
	@Input() public tab: CalendarTab = 'day';
	@Input() public dateID = '';
	@Output() readonly tabChanged = new EventEmitter<CalendarTab>();
	@Output() readonly dateChanged = new EventEmitter<string>();

	protected isWeekTabActivated = false;

	// private date: Date;
	protected recurrings?: readonly IHappeningWithUiState[];

	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		private readonly params: SpaceComponentBaseParams,
		filterService: CalendarFilterService,
		calendarStateService: CalendarStateService,
		happeningService: HappeningService,
		calendarDayService: CalendarDayService,
		sneatApiService: SneatApiService,
		calendariumSpaceService: CalendariumSpaceService,
	) {
		super(
			'CalendarComponent',
			errorLogger,
			calendariumSpaceService,
			happeningService,
			calendarDayService,
			sneatApiService,
		);

		filterService.filter.pipe(takeUntil(this.destroyed)).subscribe({
			next: (filter) => {
				this.filter = filter;
				this.recurrings = this.filterRecurrings(filter);
			},
			error: this.errorLogger.logErrorHandler('failed to get calendar filter'),
		});

		calendarStateService.dateChanged.subscribe({
			next: (changed) => {
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

	ngAfterViewInit(): void /* TODO: check and document if it can't be ngOnInit */ {
		this.tabChanged.emit(this.tab);
	}

	protected segmentChanged(event: Event): void {
		console.log('ScheduleComponent.segmentChanged()', event);
		this.isWeekTabActivated = true;
		history.replaceState(
			history.state,
			document.title,
			window.location.href.replace(/tab=\w+/, `tab=${this.tab}`),
		);
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
	// 		.navigateForwardToSpacePage(this.space, 'new-happening', {
	// 			queryParams: params,
	// 		})
	// 		.catch(this.errorLogger.logErrorHandler('failed to navigate to new happening page'));
	// };

	protected readonly onDateSelected = (date: Date): void => {
		this.tab = 'day';
		this.setDay('onDateSelected', date);
	};

	// get inactiveDay(): Day {
	//     return this.activeDayParity === 'odd' ? this.evenDay : this.oddDay;
	// }

	// noinspection JSMethodCanBeStatic

	// noinspection JSMethodCanBqw2se3333eStatic

	override ngOnChanges(changes: SimpleChanges): void {
		super.ngOnChanges(changes);
		if (changes['tab'] && this.tab === 'week') {
			this.isWeekTabActivated = true;
		}
	}

	override onRecurringsLoaded(): void {
		this.recurrings = this.filterRecurrings(this.filter);
		console.log('onRecurringsLoaded()', this.allRecurrings, this.recurrings);
	}

	// We filter recurring at calendar level, so we can share it across different components?
	private filterRecurrings(
		filter: ICalendarFilter,
	): IHappeningWithUiState[] | undefined {
		const spaceID = this.space?.id;
		if (!spaceID) {
			return;
		}
		const text = filter.text.toLowerCase();

		const filtered = this.allRecurrings?.filter((r) => {
			const title = r.brief?.title || r.dbo?.title;
			let hide = '';

			if (!hide && title && !title.trim().toLowerCase().includes(text)) {
				hide = 'title';
			}
			if (
				!hide &&
				(!r.brief ||
					!hasContact(
						spaceID,
						filter.contactIDs,
						r.brief.related || r.brief.related,
					))
			) {
				hide = 'contactIDs';
			}
			const slots = r.dbo?.slots || r.brief?.slots;
			if (!hide && !this.hasWeekday(slots, filter.weekdays)) {
				hide = 'weekdays';
			}
			if (!hide && !this.hasRepeats(filter.repeats, slots)) {
				hide = 'repeats';
			}
			console.log('hide =>', hide);
			return !hide;
		});
		console.log(
			`CalendarComponent.filterRecurrings()`,
			filter,
			this.allRecurrings,
			' => ',
			filtered,
		);

		return filtered;
	}

	// noinspection JSMethodCanBeStatic

	private hasRepeats(
		repeats: readonly string[],
		slots?: Readonly<Record<string, IHappeningSlot>>,
	): boolean {
		return (
			!repeats.length ||
			(!!slots &&
				Object.values(slots).some((slot) => repeats.includes(slot.repeats)))
		);
	}

	private hasWeekday(
		slots: Readonly<Record<string, IHappeningSlot>> | undefined,
		weekdays: readonly WeekdayCode2[],
	): boolean {
		return (
			!weekdays.length ||
			(!!slots &&
				Object.values(slots).some((slot) =>
					slot.weekdays?.some((wd) => weekdays.includes(wd)),
				))
		);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected onDayChanged(d: Date): void {
		this.changeBrowserURL();
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
	}

	private changeBrowserURL(): void {
		if (isToday(this.date)) {
			history.replaceState(
				history.state,
				document.title,
				window.location.href.replace(/&date=\d{4}-\d{2}-\d{2}/, ''),
			);
		} else {
			const isoDate = `&date=${localDateToIso(this.date)}`;
			if (!window.location.href.includes('&date')) {
				history.replaceState(
					history.state,
					document.title,
					window.location.href + isoDate,
				);
			} else {
				history.replaceState(
					history.state,
					document.title,
					window.location.href.replace(/&date=\d{4}-\d{2}-\d{2}/, isoDate),
				);
			}
		}
	}

	public ngOnInit(): void {
		setTimeout(() => (this.isWeekTabActivated = true), 500);
	}
}
