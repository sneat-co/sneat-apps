import {
	hideVirtualSlide,
	showVirtualSlide,
	VirtualSlideAnimationsStates,
	VirtualSliderAnimationStates,
} from '@sneat/components';
import { Subject } from 'rxjs';
import { animationState, isToday } from './schedule-core';
import { addDays, getToday, IDateChanged, ScheduleStateService } from './schedule-state.service';
import { Parity, Swipeable } from './swipeable-ui';


// @Injectable()
export abstract class SwipeableBaseComponent {
	protected readonly destroyed = new Subject<void>();
	public parity: Parity = 'odd';
	public date = getToday();
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
		protected readonly className: string,
		protected readonly scheduleSateService: ScheduleStateService,
		private readonly stepDays: number,
	) {
		// this.animationState = this.parity === 'odd' ? showVirtualSlide : hideVirtualSlide;
		scheduleSateService.dateChanged.subscribe({
			next: value => this.onDateChanged(value),
		});
	}

	public isToday(): boolean {
		return isToday(this.date);
	}

	onDestroy(): void { // TODO: Make sure called by every child
		this.destroyed.next();
		this.destroyed.complete();
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
		console.log(`${this.className} extends SwipeableBaseComponent.onDateChanged()`, changed);
		// this.parity = this.parity === 'odd' ? 'even' : 'odd';
		if (!this.oddSlide || !this.evenSlide) {
			return;
		}
		this.date = changed.date;
		if (!changed.shiftDirection) {
			const passive: IDateChanged = {...changed, date: addDays(changed.date, this.stepDays)};
			switch (this.parity) {
				case 'odd':
					this.oddSlide = this.oddSlide.setActiveDate(changed, 'show');
					this.evenSlide = this.evenSlide.setActiveDate(passive, 'hide')
					break;
				case 'even':
					this.evenSlide = this.evenSlide.setActiveDate(changed, 'show');
					this.oddSlide = this.oddSlide.setActiveDate(passive, 'hide');
					break;
			}
			return;
		}
		switch (this.parity) {
			case 'odd':
				this.oddSlide = { ...this.oddSlide, animationState:  hideVirtualSlide};
				this.evenSlide = this.evenSlide.setActiveDate(changed, showVirtualSlide);
				this.parity = 'even';
				break;
			case 'even':
				this.evenSlide = { ...this.evenSlide, animationState: hideVirtualSlide };
				this.oddSlide = this.oddSlide.setActiveDate(changed, showVirtualSlide);
				this.parity = 'odd';
				break;
		}
		this.animationState = animationState(this.parity, changed.shiftDirection)
	};
}
