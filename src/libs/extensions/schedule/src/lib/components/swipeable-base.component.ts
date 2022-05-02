import { EventEmitter, Output } from '@angular/core';
import { hideVirtualSlide, showVirtualSlide, VirtualSlideAnimationsStates } from '@sneat/components';
import { Subject } from 'rxjs';
import { NewHappeningParams } from '../view-models';
import { isToday, isTomorrow } from './schedule-core';
import { getToday, IDateChanged, ScheduleStateService } from './schedule-state.service';
import { Parity, Swipeable } from './swipeable-ui';


// @Injectable()
export abstract class SwipeableBaseComponent {
	protected readonly destroyed = new Subject<void>();
	protected parity: Parity = 'odd';
	public date = getToday();
	public animationState: VirtualSlideAnimationsStates = hideVirtualSlide;
	public oddSlide?: Swipeable;
	public evenSlide?: Swipeable;

	public get activeSlide(): Swipeable | undefined {
		return this.parity === 'odd' ? this.oddSlide : this.evenSlide;
	}

	public get passiveSlide(): Swipeable | undefined {
		return this.parity === 'odd' ? this.oddSlide : this.evenSlide;
	}

	protected constructor(
		protected readonly scheduleSateService: ScheduleStateService,
		private readonly stepDays: number,
	) {
		this.animationState = this.parity === 'odd' ? showVirtualSlide : hideVirtualSlide;
		scheduleSateService.dateChanged.subscribe({
			next: this.onDateChanged,
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

	private onDateChanged = (changed: IDateChanged): void => {
		// this.parity = this.parity === 'odd' ? 'even' : 'odd';
		const
			oddSlide = this.oddSlide,
			evenSlide = this.evenSlide;
		if (!oddSlide || !evenSlide) {
			return;
		}
		const d = changed.date;
		this.date = new Date(d.getFullYear(), d.getMonth(), d.getDate() + this.stepDays);
		changed = {...changed, date: this.date};
		switch (this.parity) {
			case 'odd':
				this.oddSlide = { ...oddSlide, animationState: hideVirtualSlide };
				this.evenSlide = evenSlide.setActiveDate(changed);
				this.parity = 'even';
				break;
			case 'even':
				this.evenSlide = { ...evenSlide, animationState: hideVirtualSlide };
				this.oddSlide = oddSlide?.setActiveDate(changed);
				this.parity = 'odd';
				break;
		}
	};

}
