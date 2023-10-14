import {
	hideVirtualSlide,
	showVirtualSlide,
	VirtualSliderAnimationStates,
} from '@sneat/components';
import { dateToIso } from '@sneat/core';
import { IErrorLogger } from '@sneat/logging';
import { SneatBaseComponent } from '@sneat/ui';
import { animationState, areSameDates, isToday } from './schedule-core';
import {
	addDays,
	getToday,
	IDateChanged,
	ScheduleStateService,
} from './schedule-state.service';
import { Parity, Swipeable } from './swipeable-ui';

// @Injectable()
export abstract class SwipeableBaseComponent extends SneatBaseComponent {
	public shiftDays = 0;

	public parity: Parity = 'odd';
	public date = getToday();
	public get dateAsIsoString(): string {
		return dateToIso(this.date);
	}
	public animationState?: VirtualSliderAnimationStates;
	public oddSlide?: Swipeable;
	public evenSlide?: Swipeable;

	public get activeSlide(): Swipeable | undefined {
		return this.parity === 'odd' ? this.oddSlide : this.evenSlide;
	}

	public get passiveSlide(): Swipeable | undefined {
		return this.parity === 'odd' ? this.oddSlide : this.evenSlide;
	}

	protected constructor(
		className: string,
		errorLogger: IErrorLogger,
		protected readonly scheduleSateService: ScheduleStateService,
		private readonly stepDays: number,
	) {
		super(className, errorLogger);
		// this.animationState = this.parity === 'odd' ? showVirtualSlide : hideVirtualSlide;
		scheduleSateService.dateChanged.subscribe({
			next: (value) => this.onDateChanged(value),
		});
	}

	public isToday(): boolean {
		return isToday(this.date);
	}

	public isDefaultDate(): boolean {
		const defaultDate = addDays(new Date(), this.shiftDays);
		return areSameDates(this.date, defaultDate);
	}

	swipeLeft(): void {
		this.swipeNext();
	}

	swipeNext(): void {
		this.scheduleSateService.shiftDays(+this.stepDays);
	}

	swipeRight(): void {
		this.swipePrev();
	}

	setToday(): void {
		this.scheduleSateService.setToday();
	}

	// setSlidesAnimationState(): void {
	// 	switch (this.tab) {
	// 		case 'day': {
	// 			const isOdd = this.parity === 'odd';
	// 			this.oddDay.animationState = isOdd ? showVirtualSlide : hideVirtualSlide;
	// 			this.evenDay.animationState = !isOdd ? showVirtualSlide : hideVirtualSlide;
	// 			break;
	// 		}
	// 		case 'week': {
	// 			const isOdd = this.activeWeekParity === 'odd';
	// 			this.oddWeek.animationState = isOdd ? showVirtualSlide : hideVirtualSlide;
	// 			this.evenWeek.animationState = !isOdd ? showVirtualSlide : hideVirtualSlide;
	// 			break;
	// 		}
	// 	}
	// }

	swipePrev(): void {
		this.scheduleSateService.shiftDays(-this.stepDays);
	}

	protected onDateChanged(changed: IDateChanged): void {
		const changedToLog = { ...changed, date: dateToIso(changed.date) };
		console.log(
			`${this.className} extends SwipeableBaseComponent.onDateChanged(), changed:`,
			changedToLog,
		);
		// this.parity = this.parity === 'odd' ? 'even' : 'odd';
		if (!this.oddSlide || !this.evenSlide) {
			return;
		}
		this.date = changed.date;
		if (!changed.shiftDirection) {
			const passive: IDateChanged = {
				...changed,
				date: addDays(changed.date, this.stepDays),
			};
			switch (this.parity) {
				case 'odd':
					this.oddSlide = this.oddSlide.setDate(changed, 'show');
					this.evenSlide = this.evenSlide.setDate(passive, 'hide');
					break;
				case 'even':
					this.evenSlide = this.evenSlide.setDate(changed, 'show');
					this.oddSlide = this.oddSlide.setDate(passive, 'hide');
					break;
			}
			return;
		}
		switch (this.parity) {
			case 'odd':
				this.oddSlide = { ...this.oddSlide, animationState: hideVirtualSlide };
				this.evenSlide = this.evenSlide.setDate(changed, showVirtualSlide);
				this.parity = 'even';
				break;
			case 'even':
				this.evenSlide = {
					...this.evenSlide,
					animationState: hideVirtualSlide,
				};
				this.oddSlide = this.oddSlide.setDate(changed, showVirtualSlide);
				this.parity = 'odd';
				break;
		}
		console.log('oddSlide', this.oddSlide);
		console.log('evenSlide', this.evenSlide);
		this.animationState = animationState(this.parity, changed.shiftDirection);
	}
}
