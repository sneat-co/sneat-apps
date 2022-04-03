//tslint:disable:no-unsafe-any
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';
import { concat } from 'rxjs';
import { RxRecordKey } from 'rxstore/schema';

import { wdCodeToWeekdayName } from 'sneat-shared/components/pipes';
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
} from '@sneat/components';
import { DtoRegularActivity, IHappening } from 'sneat-shared/models/dto/dto-happening';
import { SingleHappeningKind } from 'sneat-shared/models/kinds';
import { Weekday } from '@sneat/dto';
import { ICommuneIds, ISingleHappeningService } from 'sneat-shared/services/interfaces';
import { getWeekdayDate, isoStringsToDate, localDateToIso } from 'sneat-shared/utils/datetimes';
import { ICommuneMemberInfo } from '../../../models/dto/dto-commune';
import { CommuneTopPage } from '../../../pages/constants';
import { jsDayToWeekday, NewHappeningParams, SlotItem, SlotsGroup, wd2, wdNumber } from '../view-models';
import { eventToSlot, ISlotsProvider } from './slots-provider';

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
	week.weekdays = wd2.map(wd => ({ wd, title: wdCodeToWeekdayName(wd) }));
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
	public memberInfo: ICommuneMemberInfo;
	filterFocused = false;
	allRegulars?: DtoRegularActivity[];
	regulars?: DtoRegularActivity[];
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
	private filter = '';

	// nextWeekdays: SlotsGroup[];
	// prevWeekdays: SlotsGroup[];

	constructor(
		route: ActivatedRoute,
		params: TeamComponentBaseParams,
		private readonly singleHappeningService: ISingleHappeningService,
		private readonly slotsProvider: ISlotsProvider,
	) {
		super(CommuneTopPage.home, route, params);

		createWeekdays(this.oddWeek);
		createWeekdays(this.evenWeek);

		params.route.queryParamMap.subscribe(queryParams => {
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
				// tslint:disable-next-line:no-non-null-assertion
				this.setDay('segmentChanged', this.activeDay.date!);
				break;
			case 'events':
				this.slotsProvider.loadTodayAndFutureEvents(undefined)
					.subscribe(
						events => {
							const slotGroupsByDate: { [dateKey: string]: SlotsGroup } = {};
							events.forEach(event => {
								const eventStartDate = new Date(event.dtStarts);
								const dateKey = localDateToIso(eventStartDate);
								let slotGroup = slotGroupsByDate[dateKey];
								if (!slotGroup) {
									const wd = 'we';
									slotGroupsByDate[dateKey] = slotGroup = {
										wd,
										date: eventStartDate,
										title: wdCodeToWeekdayName(wd),
										slots: [],
									};
								}
								// tslint:disable-next-line:no-non-null-assertion
								slotGroup.slots!.push(eventToSlot(event));
							});
							this.todayAndFutureEvents = Object.values(slotGroupsByDate);
						},
						this.errorLogger.logError,
					);
				break;
			default:
				break;
		}
	}

	ngOnInit(): void {
		super.ngOnInit();
		this.memberInfo = history.state.member as ICommuneMemberInfo;
		if (this.memberInfo) {
			// tslint:disable-next-line:no-non-null-assertion
			this.slotsProvider.setMemberId(this.memberInfo.id!);
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
			state.date = dateToParameter(weekday.date!);
		} else if (this.segment === 'day') {
			// tslint:disable-next-line:no-non-null-assertion
			state.date = dateToParameter(this.activeDay.date!);
		}

		this.navigateForward('new-activity', { tab: type }, state);
	}

	goRegular(activity: DtoRegularActivity): void {
		this.navigateForward('regular-activity', { id: activity.id }, { happeningDto: activity }, { excludeCommuneId: true });
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
		const today = new Date();
		// tslint:disable-next-line:no-non-null-assertion
		const activeTime = this.activeDay.date!.getTime();
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
		const happeningDto: IHappening | undefined = slot.regular || slot.single;
		if (!happeningDto) {
			throw new Error('!happeningDto');
		}
		this.navigateForward(slot.kind, { id: happeningDto.id }, { happeningDto }, { excludeCommuneId: true });
	}

	public onDateSelected(date: Date): void {
		this.segment = 'day';
		this.setDay('onDateSelected', date);
	}

	// tslint:disable-next-line:prefer-function-over-method
	trackById(i: number, item: { id?: string }): RxRecordKey | undefined {
		return item.id;
	}

	// tslint:disable-next-line:prefer-function-over-method
	trackByIndex(i: number): number {
		return i;
	}

	// get inactiveDay(): Day {
	//     return this.activeDayParity === 'odd' ? this.evenDay : this.oddDay;
	// }

	// tslint:disable-next-line:prefer-function-over-method
	trackByDate(i: number, item: SlotsGroup): number | undefined {
		return item.date && item.date.getTime();
	}

	// noinspection JSMethodCanBeStatic

	protected onCommuneIdsChanged(communeIds: ICommuneIds): void {
		super.onCommuneIdsChanged(communeIds);
		if (this.communeRealId) {
			this.slotsProvider.setCommuneId(this.communeRealId)
				.subscribe(
					(regulars) => {
						console.log('Loaded regulars:', regulars);
						this.allRegulars = regulars;
						this.regulars = this.filterRegulars();
					},
					this.errorLogger.logError,
					() => {
						// this.activeWeek.weekdays = [...this.activeWeek.weekdays];
						this.setDay('onCommuneIdChanged', this.activeDay.date || new Date());
					},
				);
		}
	}

	// noinspection JSMethodCanBqw2se3333eStatic

	private filterRegulars(): DtoRegularActivity[] | undefined {
		const filter = this.filter.toLowerCase();
		if (!filter) {
			return this.allRegulars;
		}
		return this.allRegulars?.filter(r => r.title.toLowerCase().indexOf(filter) >= 0);
	}

	// noinspection JSMethodCanBeStatic

	private setDay(source: string, d: Date): void {
		console.log(`${source}: setDay:`, d, this.communeRealId);
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
				weekday.date = weekdayDate;
				if (segment === 'week' || segment === 'day' && weekday.wd === activeWd) {
					datesToLoad.push(weekday);
					// tslint:disable-next-line:no-magic-numbers
					const diff = segment === 'day' ? 1 : 7;
					const wdDate = weekday.date;
					datesToPreload.push(new Date(wdDate.getFullYear(), wdDate.getMonth(), wdDate.getDate() + diff));
					datesToPreload.push(new Date(wdDate.getFullYear(), wdDate.getMonth(), wdDate.getDate() - diff));
					if (segment === 'day') {
						const activeWeekDaysToPreload = activeWeek.weekdays
							.filter(wd =>
								!wd.date ||
								// tslint:disable-next-line:no-non-null-assertion
								!datesToPreload.some(dtp => dtp.getTime() === wd.date!.getTime()));
						activeWeekDaysToPreload.forEach(wd => {
							if (!wd.date) {
								wd.date = weekdayDate;
							}
							datesToPreload.push(wd.date);
						});
					}
				}
			}
			if (weekday.wd === activeWd) {
				this.activeDay.weekday = weekday;
			}
		});

		console.log(`segment=${segment}, datesToPreload:`, datesToPreload);
		this.singleHappeningService.readonlyTx([SingleHappeningKind], tx =>
			concat(
				this.slotsProvider.getDays(tx, ...datesToLoad),
				this.slotsProvider.preloadEvents(tx, ...datesToPreload),
			))
			.subscribe(
				() => {
				},
				err => {
					this.errorLogger.logError(err, 'Failed to load data');
				});

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
