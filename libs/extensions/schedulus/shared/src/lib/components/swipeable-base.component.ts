import { computed, signal } from '@angular/core';
import {
	hideVirtualSlide,
	showVirtualSlide,
	VirtualSliderAnimationStates,
} from '@sneat/components';
import { dateToIso } from '@sneat/core';
import { SneatBaseComponent } from '@sneat/ui';
import { animationState, areSameDates } from './calendar-core';
import {
	addDays,
	getToday,
	IDateChanged,
	CalendarStateService,
} from './calendar/calendar-state.service';
import { Parity, Swipeable } from './swipeable-ui';

// @Injectable()
export abstract class SwipeableBaseComponent extends SneatBaseComponent {
	public shiftDays = 0;

	public readonly $parity = signal<Parity>('odd');

	public readonly $date = signal(getToday());

	public get dateAsIsoString(): string {
		return dateToIso(this.$date());
	}

	public animationState?: VirtualSliderAnimationStates;
	protected isEvenSlideActivated = false;

	protected oddSlide?: Swipeable;
	protected evenSlide?: Swipeable;

	public get activeSlide(): Swipeable | undefined {
		return this.$parity() === 'odd' ? this.oddSlide : this.evenSlide;
	}

	// public get passiveSlide(): Swipeable | undefined {
	// 	return this.parity === 'odd' ? this.oddSlide : this.evenSlide;
	// }

	protected constructor(
		className: string,
		protected readonly scheduleSateService: CalendarStateService,
		private readonly stepDays: number,
	) {
		super(className);
		// this.animationState = this.parity === 'odd' ? showVirtualSlide : hideVirtualSlide;
		scheduleSateService.dateChanged.subscribe({
			next: (value) => this.onDateChanged(value),
		});
	}

	// protected isToday(): boolean {
	// 	return isToday(this.date);
	// }

	protected readonly $isDefaultDate = computed(() => {
		const defaultDate = addDays(new Date(), this.shiftDays);
		return areSameDates(this.$date(), defaultDate);
	});

	protected swipeLeft(): void {
		this.swipeNext();
	}

	protected swipeNext(): void {
		this.isEvenSlideActivated = true;
		this.scheduleSateService.shiftDays(+this.stepDays);
	}

	protected setToday(): void {
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

	protected swipePrev(): void {
		this.isEvenSlideActivated = true;
		this.scheduleSateService.shiftDays(-this.stepDays);
	}

	protected swipeRight(): void {
		this.swipePrev();
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
		this.$date.set(changed.date);
		if (!changed.shiftDirection) {
			const passive: IDateChanged = {
				...changed,
				date: addDays(changed.date, this.stepDays),
			};
			switch (this.$parity()) {
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
		switch (this.$parity()) {
			case 'odd':
				this.oddSlide = { ...this.oddSlide, animationState: hideVirtualSlide };
				this.evenSlide = this.evenSlide.setDate(changed, showVirtualSlide);
				this.$parity.set('even');
				break;
			case 'even':
				this.evenSlide = {
					...this.evenSlide,
					animationState: hideVirtualSlide,
				};
				this.oddSlide = this.oddSlide.setDate(changed, showVirtualSlide);
				this.$parity.set('odd');
				break;
		}
		console.log('oddSlide', this.oddSlide);
		console.log('evenSlide', this.evenSlide);
		this.animationState = animationState(
			this.$parity(),
			changed.shiftDirection,
		);
	}
}
