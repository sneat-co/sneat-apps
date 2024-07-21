import {
	hideVirtualSlide,
	showVirtualSlide,
	VirtualSlideAnimationsStates,
	wdCodeToWeekdayLongName,
} from '@sneat/components';
import { dateToIso, getWeekdayDate } from '@sneat/core';
// noinspection ES6PreferShortImport
import { Weekday } from '../components/calendar/weekday';
import { Observable } from 'rxjs';
import { SpaceDaysProvider } from '../services/space-days-provider';
import { getWd2 } from '@sneat/extensions/schedulus/shared';
import { Week } from './schedule-core';
import { IDateChanged } from './calendar/calendar-state.service';

export type Parity = 'odd' | 'even'; // TODO: change to 'current' | 'next' | 'prev';

export interface Swipeable {
	// TODO: Is in process of migrating to SwipeableCardBaseComponent?
	// id: string;
	readonly animationState: VirtualSlideAnimationsStates;
	readonly parity: Parity;
	readonly destroyed: Observable<void>;
	readonly activeDateID: string;
	readonly setDate: (
		changed: IDateChanged,
		animationState: VirtualSlideAnimationsStates,
	) => Swipeable;
}

function initialAnimationState(parity: Parity): VirtualSlideAnimationsStates {
	return parity === 'odd' ? showVirtualSlide : hideVirtualSlide;
}

export function swipeableDay(
	parity: Parity,
	date: Date,
	spaceDaysProvider: SpaceDaysProvider,
	destroyed: Observable<void>,
): SwipeableDay {
	const weekday = createWeekday(date, spaceDaysProvider);
	const animationState = initialAnimationState(parity);
	const activeDateID = dateToIso(date);
	let result: SwipeableDay = {
		parity,
		spaceDaysProvider,
		weekday,
		destroyed,
		animationState,
		activeDateID,
		setDate: undefined as unknown as (changed: IDateChanged) => SwipeableDay,
	};
	const setDate = (
		changed: IDateChanged,
		animationState: VirtualSlideAnimationsStates,
	) => {
		const changedToLog = { ...changed, date: dateToIso(changed.date) };
		console.log(`swipeableDay.setDate(), changed:`, changedToLog);
		const { date } = changed;
		const v: SwipeableDay = {
			...result,
			animationState,
			activeDateID: dateToIso(date),
			weekday: createWeekday(date, spaceDaysProvider),
		};
		return v;
	};
	result = { ...result, setDate };
	return result;
}

function createWeekday(
	date: Date,
	teamDaysProvider: SpaceDaysProvider,
): Weekday {
	const id = getWd2(date);
	return {
		id,
		longTitle: wdCodeToWeekdayLongName(id),
		day: teamDaysProvider.getSpaceDay(date),
	};
}

export interface SwipeableDay extends Swipeable {
	// private readonly dayChanged = new Subject<void>();
	weekday: Weekday;
	spaceDaysProvider: SpaceDaysProvider;
	// public animationState: VirtualSlideAnimationsStates;

	// constructor(
	// 	public readonly parity: Parity,
	// 	public date: Date,
	// 	private readonly teamDaysProvider: TeamDaysProvider,
	// 	private readonly destroyed: Observable<void>,
	// ) {
	// 	this.animationState = parity === 'odd' ? showVirtualSlide : hideVirtualSlide;
	// 	this.id = dateToIso(date);
	// 	console.log(`SwipeableDay.constructor(parity=${parity}, date=${this.id})`);
	// 	this.weekday = this.createDay(date);
	// }
	//
	// public setActiveDate(date: Date): void {
	// 	const id = dateToIso(date);
	// 	if (id === '1970-01-01') {
	// 		throw new Error('an attempt to set an empty date 1970-01-01');
	// 	}
	// 	console.log(`SwipeableDay.changeDate(${id}), parity=${this.parity}`);
	// 	if (id === this.id) {
	// 		console.warn(`SwipeableDay.changeDate() - got duplicate call with same day "${id}"`);
	// 		return;
	// 	}
	// 	this.id = id;
	// 	this.date = date;
	// 	this.dayChanged.next();
	// 	this.weekday = this.createDay(date);
	// }
	//
	// private createDay(date: Date): Weekday {
	// 	const id = getWd2(date);
	// 	return {
	// 		id,
	// 		longTitle: wdCodeToWeekdayLongName(id),
	// 		day: this.teamDaysProvider.getTeamDay(date),
	// 	};
	// }
}

export interface SwipeableWeek extends Swipeable, Week {
	readonly startDate: Date;
	readonly endDate: Date;

	// public _activeDate: Date;
	//
	// public get activeDate() {
	// 	return this._activeDate;
	// }
	//
	// constructor(
	// 	public readonly parity: Parity,
	// 	private readonly teamDaysProvider: TeamDaysProvider,
	// 	private readonly destroyed: Observable<void>,
	// ) {
	// 	this.animationState = parity === 'odd' ? showVirtualSlide : hideVirtualSlide;
	// 	this._activeDate = new Date();
	// 	this.startDate = getWeekdayDate(this._activeDate, 0);
	// 	this.endDate = getWeekdayDate(this._activeDate, 6);
	// }
	//
	// public setActiveDate(v: Date) {
	// 	this._activeDate = v;
	// 	this.startDate = getWeekdayDate(v, 0);
	// 	this.endDate = getWeekdayDate(v, 6);
	// }
}

export function swipeableWeek(
	parity: Parity,
	date: Date,
	teamDaysProvider: SpaceDaysProvider,
	destroyed: Observable<void>,
): SwipeableWeek {
	const activeDateID = dateToIso(date);
	const animationState = initialAnimationState(parity);
	let result: SwipeableWeek = {
		animationState,
		startDate: getWeekdayDate(date, 0),
		endDate: getWeekdayDate(date, 6),
		parity,
		activeDateID,
		destroyed,
		setDate: undefined as unknown as (changed: IDateChanged) => SwipeableWeek,
	};
	const setActiveDate = (
		changed: IDateChanged,
		animationState: VirtualSlideAnimationsStates,
	) => {
		const { date } = changed;
		const v: SwipeableWeek = {
			...result,
			animationState,
			activeDateID: dateToIso(date),
			startDate: getWeekdayDate(date, 0),
			endDate: getWeekdayDate(date, 6),
		};
		return v;
	};
	result = { ...result, setDate: setActiveDate };
	return result;
}
