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
} from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import {
	hideVirtualSlide,
	showVirtualSlide,
	virtualSliderAnimations,
	VirtualSliderAnimationStates,
} from '@sneat/components';
import { getWeekdayDate, localDateToIso } from '@sneat/core';
import { IHappeningDto, IRecurringActivityWithUiState, Weekday } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { IMemberContext, ITeamContext } from '@sneat/team/models';
import { Subject, takeUntil } from 'rxjs';
import { SlotsProvider } from '../../pages/schedule/slots-provider';
import { Day, ISlotItem, jsDayToWeekday, NewHappeningParams, wdNumber } from '../../view-models';
import {
	animationState,
	createWeekdays,
	getWdDate,
	ScheduleTab,
	setWeekStartAndEndDates,
	SHIFT_1_DAY,
	SHIFT_1_WEEK,
	Week,
} from './schedule-core';
import { Parity, SwipeableDay } from './swipeable-ui';

@Component({
	selector: 'sneat-schedule',
	templateUrl: './schedule.component.html',
	styleUrls: ['./schedule.component.scss'],
	animations: virtualSliderAnimations,
})
export class ScheduleComponent implements AfterViewInit, OnChanges, OnDestroy {

	@Input() team?: ITeamContext;
	@Input() public tab: ScheduleTab = 'day';
	@Input() public date = '';

	@Output() readonly tabChanged = new EventEmitter<ScheduleTab>();
	@Output() readonly dateChanged = new EventEmitter<string>();
	public showRecurring = true;
	public showEvents = true;
	todayAndFutureEvents?: Day[];
	public member?: IMemberContext;
	filterFocused = false;
	allRegulars?: IRecurringActivityWithUiState[];
	regulars?: IRecurringActivityWithUiState[];
	activeDayParity: Parity = 'odd';
	activeWeekParity: Parity = 'odd';
	oddDay: SwipeableDay;
	evenDay: SwipeableDay;
	readonly oddWeek: Week = {
		parity: 'odd',
		animationState: showVirtualSlide,
		weekdays: createWeekdays(),
	};
	readonly evenWeek: Week = {
		parity: 'even',
		animationState: hideVirtualSlide,
		weekdays: createWeekdays(),
	};
	weekAnimationState?: VirtualSliderAnimationStates = undefined;
	dayAnimationState?: VirtualSliderAnimationStates = undefined;
	public filter = '';
	private readonly destroyed = new Subject<void>();

	// nextWeekdays: SlotsGroup[];
	// prevWeekdays: SlotsGroup[];
	private readonly slotsProvider: SlotsProvider;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly params: TeamComponentBaseParams,
		afs: AngularFirestore,
	) {
		this.slotsProvider = new SlotsProvider(afs);
		const today = new Date();
		const tomorrow = new Date();
		tomorrow.setDate(today.getDate() + 1)
		const destroyed = this.destroyed.asObservable();
		this.oddDay = new SwipeableDay('odd', today, showVirtualSlide, this.slotsProvider, destroyed);
		this.evenDay = new SwipeableDay('even', tomorrow, hideVirtualSlide, this.slotsProvider, destroyed);

		// setTimeout(() => {
		// 	// TODO: Fix this dirty workaround for initial animations
		// 	this.setToday();
		// }, 10);
	}

	get activeDay(): SwipeableDay {
		return this.activeDayParity === 'odd' ? this.oddDay : this.evenDay;
	}

	get activeWeek(): Week {
		return this.activeWeekParity === 'odd' ? this.oddWeek : this.evenWeek;
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['team']) {
			this.onTeamContextChanged();
		}
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}

	ngAfterViewInit(): void {
		this.tabChanged.emit(this.tab);
	}

	swipeLeft(): void {
		console.log('swipeLeft()');
		switch (this.tab) {
			case 'day':
				this.changeDay(+SHIFT_1_DAY);
				break;
			case 'week':
				// tslint:disable-next-line:no-magic-numbers
				this.changeDay(+SHIFT_1_WEEK);
				break;
			default:
				break;
		}
	}

	swipeRight(): void {
		console.log('swipeRight()');
		switch (this.tab) {
			case 'day':
				this.changeDay(-SHIFT_1_DAY);
				break;
			case 'week':
				// tslint:disable-next-line:no-magic-numbers
				this.changeDay(-SHIFT_1_WEEK);
				break;
			default:
				break;
		}
	}

	segmentChanged(event: Event): void {
		console.log('ScheduleComponent.segmentChanged()', event);
		history.replaceState(history.state, document.title, location.href.replace(/tab=\w+/, `tab=${this.tab}`));
		switch (this.tab) {
			case 'week':
				if (this.activeDay.date) {
					this.setDay('segmentChanged', this.activeDay.date);
				} else {
					throw new Error('activeDay has no date');
				}
				break;
			case 'events':
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
			this.showRecurring = true;
		}
	}

	onShowRegularChanged(): void {
		if (!this.showRecurring) {
			this.showEvents = true;
		}
	}

	goNew(params: NewHappeningParams): void {
		const { type, weekday } = params;
		const dateToParameter = (d: Date): string => d.toISOString()
			.split('T')[0];

		const state: { type: 'regular' | 'single'; date?: string; wd?: Weekday } = { type };

		if (weekday) {
			state.wd = weekday.wd;
			// tslint:disable-next-line:no-non-null-assertion
			if (weekday.date) {
				state.date = dateToParameter(weekday.date);
			}
		} else if (this.tab === 'day') {
			if (this.activeDay.date) {
				state.date = dateToParameter(this.activeDay.date);
			}
		}
		if (!this.team) {
			this.errorLogger.logError('!this.team');
			return;
		}
		this.params.teamNavService
			.navigateForwardToTeamPage(this.team, 'new-activity', {})
			.then(this.errorLogger.logError);
	}

	goRegular(activity: IRecurringActivityWithUiState): void {
		this.errorLogger.logError('not implemented yet');
		// this.navigateForward('regular-activity', { id: activity.id }, { happeningDto: activity }, { excludeCommuneId: true });
	}

	applyFilter(filter: string): void {
		console.log(`applyFilter(${filter})`);
		this.filter = filter.toLowerCase();
		if (this.tab === 'regular') {
			this.regulars = this.filterRegulars();
		}
	}

	isToday(): boolean {
		const day = this.activeDay.date;
		const today = new Date();
		return !day ||
			day.getDate() === today.getDate() &&
			day.getMonth() === today.getMonth() &&
			day.getFullYear() === today.getFullYear();
	}

	isTomorrow(): boolean {
		const day = this.activeDay.date;
		const today = new Date();
		return !day ||
			day.getDate() === today.getDate() + 1 &&
			day.getMonth() === today.getMonth() &&
			day.getFullYear() === today.getFullYear();
	}

	isCurrentWeek(): boolean {
		const monday = this.activeWeek && this.activeWeek.startDate;
		const today = new Date();
		return !monday || monday.getTime() === getWeekdayDate(today, 0)
			.getTime();
	}

	changeDay(v: number): void {
		const d = this.activeDay.date;
		console.log(`changeDay(${v}) => segment=${this.tab}, activeDay.date:`, d);
		switch (this.tab) {
			case 'day':
				this.activeDayParity = this.activeDayParity === 'odd' ? 'even' : 'odd';
				this.dayAnimationState = animationState(this.activeDayParity, v);
				break;
			case 'week':
				this.activeWeekParity = this.activeWeekParity === 'odd' ? 'even' : 'odd';
				this.weekAnimationState = animationState(this.activeWeekParity, v);
				break;
			default:
				return;
		}
		if (!d) {
			throw new Error('!d');
		}
		this.setDay('changeDay', new Date(d.getFullYear(), d.getMonth(), d.getDate() + v));
	}

	setToday(): void {
		console.log('ScheduleComponent.setToday()');
		if (!this.activeDay.date) {
			this.errorLogger.logError('!this.activeDay.date');
			return;
		}
		const today = new Date();
		const activeTime = this.activeDay.date.getTime();
		switch (this.tab) {
			case 'day':
				this.activeDayParity = this.activeDayParity === 'odd' ? 'even' : 'odd';
				if (today.getTime() > activeTime) {
					this.dayAnimationState = animationState(this.activeDayParity, +1);
				} else if (today.getTime() < activeTime) {
					this.dayAnimationState = animationState(this.activeDayParity, -1);
				}
				break;
			case 'week':
				this.activeWeekParity = this.activeWeekParity === 'odd' ? 'even' : 'odd';
				if (today.getTime() > activeTime) {
					this.weekAnimationState = animationState(this.activeWeekParity, +1);
				} else if (today.getTime() < activeTime) {
					this.weekAnimationState = animationState(this.activeWeekParity, -1);
				}
				break;
			default:
				break;
		}
		this.setDay('today', today);
	}

	setSlidesAnimationState(): void {
		const isOdd = this.activeDayParity === 'odd';
		switch (this.tab) {
			case 'day':
				this.oddDay.animationState = isOdd ? showVirtualSlide : hideVirtualSlide;
				this.evenDay.animationState = !isOdd ? showVirtualSlide : hideVirtualSlide;
				break;
			case 'week':
				this.oddWeek.animationState = isOdd ? showVirtualSlide : hideVirtualSlide;
				this.evenWeek.animationState = !isOdd ? showVirtualSlide : hideVirtualSlide;
				break;
		}
	}

	goActivity(slot: ISlotItem): void {
		const happeningDto: IHappeningDto | undefined = slot.recurring || slot.single;
		if (!happeningDto) {
			throw new Error('!happeningDto');
		}
		this.errorLogger.logError('not implemented yet');
		// this.navigateForward(slot.kind, { id: happeningDto.id }, { happeningDto }, { excludeCommuneId: true });
	}

	public onDateSelected(date: Date): void {
		this.tab = 'day';
		this.setDay('onDateSelected', date);
	}

	readonly id = (i: number, v: { id: string }): string => v.id;

	// tslint:disable-next-line:prefer-function-over-method
	readonly index = (i: number): number => i;

	// get inactiveDay(): Day {
	//     return this.activeDayParity === 'odd' ? this.evenDay : this.oddDay;
	// }

	// tslint:disable-next-line:prefer-function-over-method
	trackByDate(i: number, item: Day): number | undefined {
		return item.date && item.date.getTime();
	}

	// noinspection JSMethodCanBeStatic

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
			this.slotsProvider.setTeam(this.team);
		}
		if (this.activeDay?.date) {
			this.setDay('onTeamDtoChanged', this.activeDay.date);
		}
	}

	// noinspection JSMethodCanBqw2se3333eStatic

	private filterRegulars(): IRecurringActivityWithUiState[] | undefined {
		const filter = this.filter.toLowerCase();
		if (!filter) {
			return this.allRegulars;
		}
		return this.allRegulars?.filter(r => r.dto.title && r.dto.title.toLowerCase().indexOf(filter) >= 0);
	}

	// noinspection JSMethodCanBeStatic

	private setDay(source: string, d: Date): void {
		console.log(`ScheduleComponent.setDay(source=${source}), d=`, d);
		if (!d) {
			return;
		}

		const { tab } = this;
		this.setSlidesAnimationState();
		const activeWd = jsDayToWeekday(d.getDay() as wdNumber);

		this.activeDay.changeDate(d);


		const activeWeek = this.activeWeek;
		setWeekStartAndEndDates(activeWeek, d);
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
			history.replaceState(history.state, document.title, location.href.replace(/\?date=\d{4}-\d{2}-\d{2}/, ''));
		} else {
			const isoDate = `?date=${localDateToIso(d)}`;
			if (location.href.indexOf('?date') < 0) {
				history.replaceState(history.state, document.title, location.href + isoDate);
			} else {
				history.replaceState(history.state, document.title, location.href.replace(/\?date=\d{4}-\d{2}-\d{2}/, isoDate));
			}
		}
	}

	private onSetDateWhenDayTabIsActive(): void {
		//
	}

	private onSetDateWhenWeekTabIsActive(): void {
		//
	}

	private getDayData(d: Date): void {

	}

	private getWeeekData(): void {
		//
	}

	// get inactiveWeek(): Week {
	//     return this.activeWeekParity === 'odd' ? this.evenWeek : this.oddWeek;
	// }
}
