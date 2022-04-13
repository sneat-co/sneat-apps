//tslint:disable:no-unsafe-any
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import {
	hideVirtualSlide,
	showVirtualSlide,
	VirtualSlideAnimationsStates,
	virtualSliderAnimations,
	VirtualSliderAnimationStates,
	VirtualSliderDirectPushedNext,
	VirtualSliderDirectPushedPrev,
	VirtualSliderReversePushedNext,
	VirtualSliderReversePushedPrev,
	wdCodeToWeekdayName,
} from '@sneat/components';
import { getWeekdayDate, isoStringsToDate, localDateToIso } from '@sneat/core';
import { IHappeningDto, IRecurringActivityWithUiState, Weekday } from '@sneat/dto';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';
import { IMemberContext } from '@sneat/team/models';
import { jsDayToWeekday, NewHappeningParams, SlotItem, SlotsGroup, wd2, wdNumber } from '../../view-models';

function getWdDate(wd: Weekday, activeWd: Weekday, activeDate: Date): Date {
	if (wd === activeWd) {
		return activeDate;
	}
	const wdIndex = wd2.indexOf(wd);
	const dayIndex = wd2.indexOf(activeWd);
	return new Date(
		activeDate.getFullYear(),
		activeDate.getMonth(),
		activeDate.getDate() + wdIndex - dayIndex,
	);
}

function setWeekStartAndEndDates(week: Week, activeDate: Date): void {
	console.log('setWeekRange', activeDate, week);
	week.monday = getWeekdayDate(activeDate, 0);
	// tslint:disable-next-line:no-magic-numbers
	week.sunday = getWeekdayDate(activeDate, 6);
}

type Parity = 'odd' | 'even';

interface Sweepable {
	animationState: VirtualSlideAnimationsStates;
	parity: Parity;
}

interface Day extends Sweepable {
	date?: Date;
	weekday?: SlotsGroup;
}

interface Week extends Sweepable {
	weekdays: SlotsGroup[];
	monday?: Date;
	sunday?: Date;
}

function createWeekdays(week: Week): void {
	week.weekdays = wd2.map(wd => ({ wd, title: wdCodeToWeekdayName(wd), slots: [] }));
}

@Component({
	selector: 'sneat-schedule-page',
	templateUrl: './schedule-page.component.html',
	styleUrls: ['./schedule-page.component.scss'],
	providers: [TeamComponentBaseParams],
	animations: virtualSliderAnimations,
})
// tslint:disable-next-line:component-class-suffix
export class SchedulePageComponent extends TeamBaseComponent implements OnInit {

	segment: 'day' | 'week' | 'regular' | 'events' = 'week';
	public showRegulars = true;
	public showEvents = true;
	todayAndFutureEvents?: SlotsGroup[];
	public member?: IMemberContext;
	filterFocused = false;
	allRegulars?: IRecurringActivityWithUiState[];
	regulars?: IRecurringActivityWithUiState[];
	activeDayParity: Parity = 'odd';
	activeWeekParity: Parity = 'odd';
	oddDay: Day = {
		parity: 'odd',
		animationState: showVirtualSlide,
		weekday: undefined,
		date: undefined,
	};
	evenDay: Day = {
		parity: 'even',
		animationState: hideVirtualSlide,
		weekday: undefined,
		date: undefined,
	};
	oddWeek: Week = {
		parity: 'odd',
		animationState: showVirtualSlide,
		weekdays: [],
	};
	evenWeek: Week = {
		parity: 'even',
		animationState: hideVirtualSlide,
		weekdays: [],
	};
	weekAnimationState: VirtualSliderAnimationStates = VirtualSliderDirectPushedPrev;
	dayAnimationState: VirtualSliderAnimationStates = VirtualSliderDirectPushedPrev;

	public filter = '';

	// nextWeekdays: SlotsGroup[];
	// prevWeekdays: SlotsGroup[];

	constructor(
		route: ActivatedRoute,
		params: TeamComponentBaseParams,
		// private readonly singleHappeningService: ISingleHappeningService,
		// private readonly slotsProvider: ISlotsProvider,
	) {
		super('SchedulePageComponent', route, params);

		createWeekdays(this.oddWeek);
		createWeekdays(this.evenWeek);

		this.route?.queryParamMap.subscribe(queryParams => {
			const tab = queryParams.get('tab');
			if (tab) {
				switch (tab) {
					case 'day':
					case 'week':
					case 'regular':
					case 'events':
						this.segment = tab;
						break;
					default:
						history.replaceState(history.state, document.title, `${location.href}&tab=${this.segment}`);
						break;
				}
			}
			const date = queryParams.get('date');
			if (date) {
				this.activeDay.date = isoStringsToDate(date);
			}
		});
	}

	get activeDay(): Day {
		return this.activeDayParity === 'odd' ? this.oddDay : this.evenDay;
	}

	get activeWeek(): Week {
		return this.activeWeekParity === 'odd' ? this.oddWeek : this.evenWeek;
	}

	swipeLeft(): void {
		console.log('swipeLeft()');
		switch (this.segment) {
			case 'day':
				this.changeDay(+1);
				break;
			case 'week':
				// tslint:disable-next-line:no-magic-numbers
				this.changeDay(+7);
				break;
			default:
				break;
		}
	}

	swipeRight(): void {
		console.log('swipeRight()');
		switch (this.segment) {
			case 'day':
				this.changeDay(-1);
				break;
			case 'week':
				// tslint:disable-next-line:no-magic-numbers
				this.changeDay(-7);
				break;
			default:
				break;
		}
	}

	segmentChanged(): void {
		history.replaceState(history.state, document.title, location.href.replace(/tab=\w+/, `tab=${this.segment}`));
		switch (this.segment) {
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

	ngOnInit(): void {
		this.member = history.state.member as IMemberContext;
		if (this.member) {
			// this.slotsProvider.setMemberId(this.member.id);
		}
	}

	onShowEventsChanged(): void {
		if (!this.showEvents) {
			this.showRegulars = true;
		}
	}

	onShowRegularChanged(): void {
		if (!this.showRegulars) {
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
		} else if (this.segment === 'day') {
			if (this.activeDay.date) {
				state.date = dateToParameter(this.activeDay.date);
			}
		}
		if (!this.team) {
			this.errorLogger.logError('!this.team');
			return;
		}
		this.teamNav
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
		if (this.segment === 'regular') {
			this.regulars = this.filterRegulars();
		}
	}

	isToday(): boolean {
		const day = this.activeDay.date;
		const today = new Date();
		return !day || day.getDate() === today.getDate() && day.getMonth() === today.getMonth() && day.getFullYear() === today.getFullYear();
	}

	isCurrentWeek(): boolean {
		const monday = this.activeWeek && this.activeWeek.monday;
		const today = new Date();
		return !monday || monday.getTime() === getWeekdayDate(today, 0)
			.getTime();
	}

	changeDay(v: number): void {
		const d = this.activeDay.date;
		console.log('changeDay', d);
		switch (this.segment) {
			case 'day':
				this.activeDayParity = this.activeDayParity === 'odd' ? 'even' : 'odd';
				this.dayAnimationState = animationState(this.activeDayParity, v);
				break;
			case 'week':
				this.activeWeekParity = this.activeWeekParity === 'odd' ? 'even' : 'odd';
				this.weekAnimationState = animationState(this.activeWeekParity, v);
				break;
			default:
				break;
		}
		if (!d) {
			throw new Error('!d');
		}
		this.setDay('changeDay', new Date(d.getFullYear(), d.getMonth(), d.getDate() + v));
	}

	setToday(): void {
		if (!this.activeDay.date) {
			this.errorLogger.logError('!this.activeDay.date');
			return;
		}
		const today = new Date();
		const activeTime = this.activeDay.date.getTime();
		switch (this.segment) {
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
		switch (this.segment) {
			case 'day':
				this.oddDay.animationState = this.activeDayParity === 'odd' ? showVirtualSlide : hideVirtualSlide;
				this.evenDay.animationState = this.activeDayParity === 'even' ? showVirtualSlide : hideVirtualSlide;
				break;
			case 'week':
				this.oddWeek.animationState = this.activeWeekParity === 'odd' ? showVirtualSlide : hideVirtualSlide;
				this.evenWeek.animationState = this.activeWeekParity === 'even' ? showVirtualSlide : hideVirtualSlide;
				break;
			default:
				break;
		}
	}

	goActivity(slot: SlotItem): void {
		const happeningDto: IHappeningDto | undefined = slot.recurring || slot.single;
		if (!happeningDto) {
			throw new Error('!happeningDto');
		}
		this.logError('not implemented yet');
		// this.navigateForward(slot.kind, { id: happeningDto.id }, { happeningDto }, { excludeCommuneId: true });
	}

	public onDateSelected(date: Date): void {
		this.segment = 'day';
		this.setDay('onDateSelected', date);
	}

	readonly id = (i: number, v: { id: string }): string => v.id;

	// tslint:disable-next-line:prefer-function-over-method
	readonly index = (i: number): number => i;

	// get inactiveDay(): Day {
	//     return this.activeDayParity === 'odd' ? this.evenDay : this.oddDay;
	// }

	// tslint:disable-next-line:prefer-function-over-method
	trackByDate(i: number, item: SlotsGroup): number | undefined {
		return item.date && item.date.getTime();
	}

	// noinspection JSMethodCanBeStatic

	protected override onTeamIdChanged(): void {
		super.onTeamIdChanged();
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
		console.log(`${source}: setDay:`, d);
		if (!d) {
			return;
		}
		// tslint:disable-next-line:no-this-assignment
		const { segment } = this;
		this.setSlidesAnimationState();
		const activeWd = jsDayToWeekday(d.getDay() as wdNumber);
		this.activeDay.date = d;
		const activeWeek = this.activeWeek;
		setWeekStartAndEndDates(activeWeek, d);
		const datesToPreload: Date[] = [];
		const datesToLoad: SlotsGroup[] = [];
		activeWeek.weekdays.forEach((weekday) => {
			const weekdayDate = getWdDate(weekday.wd, activeWd, d);
			if (!weekday.date || weekday.date.getTime() !== weekdayDate.getTime() || !weekday.slots) {
				// console.log('weekday.date !== weekdayDate', weekday.date, weekdayDate);
				weekday = { ...weekday, date: weekdayDate };
				if (segment === 'week' || segment === 'day' && weekday.wd === activeWd) {
					datesToLoad.push(weekday);
					// tslint:disable-next-line:no-magic-numbers
					const diff = segment === 'day' ? 1 : 7;
					const wdDate = weekday.date;
					if (wdDate) {
						datesToPreload.push(new Date(wdDate.getFullYear(), wdDate.getMonth(), wdDate.getDate() + diff));
						datesToPreload.push(new Date(wdDate.getFullYear(), wdDate.getMonth(), wdDate.getDate() - diff));
					}
					if (segment === 'day') {
						const activeWeekDaysToPreload = activeWeek.weekdays
							.filter(wd =>
								!wd.date ||
								// tslint:disable-next-line:no-non-null-assertion
								!datesToPreload.some(dtp => dtp.getTime() === wd.date?.getTime()));
						activeWeekDaysToPreload.forEach(wd => {
							if (!wd.date) {
								// wd.date = weekdayDate;
								this.errorLogger.logError('not implemented yet: !wd.date');
							} else {
								datesToPreload.push(wd.date);
							}
						});
					}
				}
			}
			if (weekday.wd === activeWd) {
				this.activeDay.weekday = weekday;
			}
		});

		console.log(`segment=${segment}, datesToPreload:`, datesToPreload);
		// this.singleHappeningService.readonlyTx([SingleHappeningKind], tx =>
		// 	concat(
		// 		this.slotsProvider.getDays(tx, ...datesToLoad),
		// 		this.slotsProvider.preloadEvents(tx, ...datesToPreload),
		// 	))
		// 	.subscribe(
		// 		() => {
		// 		},
		// 		err => {
		// 			this.errorLogger.logError(err, 'Failed to load data');
		// 		});

		// Change URL
		if (this.isToday()) {
			history.replaceState(history.state, document.title, location.href.replace(/&date=\d{4}-\d{2}-\d{2}/, ''));
		} else {
			const isoDate = `&date=${localDateToIso(d)}`;
			if (location.href.indexOf('&date') < 0) {
				history.replaceState(history.state, document.title, location.href + isoDate);
			} else {
				history.replaceState(history.state, document.title, location.href.replace(/&date=\d{4}-\d{2}-\d{2}/, isoDate));
			}
		}
	}

	// get inactiveWeek(): Week {
	//     return this.activeWeekParity === 'odd' ? this.evenWeek : this.oddWeek;
	// }
}


function animationState(activeParity: Parity, diff: number): VirtualSliderAnimationStates {
	let result: VirtualSliderAnimationStates;
	switch (activeParity) {
		case 'odd':
			if (diff > 0) {
				result = VirtualSliderReversePushedNext;
			} else if (diff < 0) {
				result = VirtualSliderDirectPushedPrev;
			} else {
				throw new Error(`Invalid v: ${diff}`);
			}
			break;
		case 'even':
			if (diff > 0) {
				result = VirtualSliderDirectPushedNext;
			} else if (diff < 0) {
				result = VirtualSliderReversePushedPrev;
			} else {
				throw new Error(`Invalid v: ${diff}`);
			}
			break;
		default:
			throw new Error(`Unknown parity: ${activeParity}`);
	}
	console.log(`animationState(${activeParity}): ${result}`);
	return result;
}
