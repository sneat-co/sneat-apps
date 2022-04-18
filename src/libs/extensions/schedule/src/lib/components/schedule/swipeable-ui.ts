import { VirtualSlideAnimationsStates, wdCodeToWeekdayLongName } from '@sneat/components';
import { dateToIso } from '@sneat/core';
import { Observable, Subject } from 'rxjs';
import { TeamDaysProvider } from '../../pages/schedule/team-days-provider';
import { getWd2 } from '../../view-models';
import { Weekday } from '../schedule-week/schedule-week.component';

export type Parity = 'odd' | 'even'; // TODO: change to 'current' | 'next' | 'prev';

export interface Swipeable {
	animationState: VirtualSlideAnimationsStates;
	readonly parity: Parity;
}

export class SwipeableDay implements Swipeable { // TODO: make an NG component or join with ScheduleDayComponent?
	private readonly dayChanged = new Subject<void>();
	id: string;
	weekday: Weekday;

	constructor(
		public readonly parity: Parity,
		public date: Date,
		public animationState: VirtualSlideAnimationsStates,
		private readonly teamDaysProvider: TeamDaysProvider,
		private readonly destroyed: Observable<void>,
	) {
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
