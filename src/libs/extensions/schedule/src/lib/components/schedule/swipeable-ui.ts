import { VirtualSlideAnimationsStates, wdCodeToWeekdayLongName } from '@sneat/components';
import { dateToIso } from '@sneat/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SlotsProvider } from '../../pages/schedule/slots-provider';
import { Day, getWd2, ISlotItem } from '../../view-models';

export type Parity = 'odd' | 'even';

export interface Swipeable {
	animationState: VirtualSlideAnimationsStates;
	readonly parity: Parity;
}

export class SwipeableDay implements Swipeable { // TODO: make an NG component or join with ScheduleDayComponent?
	id: string;
	weekday: Day;
	private readonly dayChanged = new Subject<void>();

	constructor(
		public readonly parity: Parity,
		public date: Date,
		public animationState: VirtualSlideAnimationsStates,
		private readonly slotsProvider: SlotsProvider,
		private readonly destroyed: Observable<void>,
	) {
		this.id = dateToIso(date);
		console.log(`SwipeableDay.constructor(parity=${parity}, date=${this.id})`);
		this.weekday = this.createDay(date);
		this.subscribeForDaySlots();
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
		this.subscribeForDaySlots();
	}

	private subscribeForDaySlots(): void {
		const daySlotsProvider = this.slotsProvider.getDaySlotsProvider(this.date);
		daySlotsProvider.slots$
			.pipe(
				takeUntil(this.dayChanged.asObservable()),
				takeUntil(this.destroyed),
			)
			.subscribe(this.processSlots);
	}

	private processSlots = (slots?: ISlotItem[]) => {
		console.log(`SwipeableDay.processSlots(day=${this.id}), slots:`, slots);
		this.weekday.slots = slots;
		console.log(`SwipeableDay.processSlots(day=${this.id}), weekday.slots:`, this.weekday.slots);
	};

	private createDay(date: Date): Day {
		const wd = getWd2(date);
		const title = wdCodeToWeekdayLongName(wd);
		return { wd, date, longTitle: title };
	}
}
