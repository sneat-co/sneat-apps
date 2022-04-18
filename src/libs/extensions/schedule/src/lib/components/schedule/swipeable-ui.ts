import {
	hideVirtualSlide,
	showVirtualSlide,
	VirtualSlideAnimationsStates,
	wdCodeToWeekdayLongName,
} from '@sneat/components';
import { dateToIso, getWeekdayDate } from '@sneat/core';
import { Observable, Subject } from 'rxjs';
import { TeamDaysProvider } from '../../pages/schedule/team-days-provider';
import { getWd2 } from '../../view-models';
import { Weekday } from '../schedule-week/schedule-week.component';
import { Week } from './schedule-core';

export type Parity = 'odd' | 'even'; // TODO: change to 'current' | 'next' | 'prev';

export interface Swipeable {
	animationState: VirtualSlideAnimationsStates;
	readonly parity: Parity;
}

export class SwipeableDay implements Swipeable { // TODO: make an NG component or join with ScheduleDayComponent?
	private readonly dayChanged = new Subject<void>();
	id: string;
	weekday: Weekday;
	public animationState: VirtualSlideAnimationsStates;

	constructor(
		public readonly parity: Parity,
		public date: Date,
		private readonly teamDaysProvider: TeamDaysProvider,
		private readonly destroyed: Observable<void>,
	) {
		this.animationState = parity === 'odd' ? showVirtualSlide : hideVirtualSlide;
		this.id = dateToIso(date);
		console.log(`SwipeableDay.constructor(parity=${parity}, date=${this.id})`);
		this.weekday = this.createDay(date);
	}

	public changeDate(date: Date): void {
		const id = dateToIso(date);
		if (id === '1970-01-01') {
			throw new Error('an attempt to set an empty date 1970-01-01');
		}
		console.log(`SwipeableDay.changeDate(${id}), parity=${this.parity}`);
		if (id === this.id) {
			console.warn(`SwipeableDay.changeDate() - got duplicate call with same day "${id}"`);
			return;
		}
		this.id = id;
		this.date = date;
		this.dayChanged.next();
		this.weekday = this.createDay(date);
	}

	private createDay(date: Date): Weekday {
		const id = getWd2(date);
		return {
			id,
			longTitle: wdCodeToWeekdayLongName(id),
			day: this.teamDaysProvider.getTeamDay(date),
		};
	}
}

export class SwipeableWeek implements Swipeable, Week {
	public startDate: Date;
	public endDate: Date;
	public animationState: VirtualSlideAnimationsStates;

	public _activeDate: Date;

	public get activeDate() {
		return this._activeDate;
	}

	public set activeDate(v: Date) {
		this._activeDate = v;
		this.startDate = getWeekdayDate(v, 0);
		this.endDate = getWeekdayDate(v, 6);
	}

	constructor(
		public readonly parity: Parity,
		private readonly teamDaysProvider: TeamDaysProvider,
		private readonly destroyed: Observable<void>,
	) {
		this.animationState = parity === 'odd' ? showVirtualSlide : hideVirtualSlide;
		this._activeDate = new Date();
		this.startDate = getWeekdayDate(this._activeDate, 0);
		this.endDate = getWeekdayDate(this._activeDate, 6);
	}
}
