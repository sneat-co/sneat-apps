import { dateToIso } from '@sneat/core';
import { IDateChanged, ScheduleStateService } from '../schedule-state.service';
import { SwipeableBaseComponent } from '../swipeable-base.component';
import { SwipeableDay } from '../swipeable-ui';

export abstract class ScheduleDayBaseComponent extends SwipeableBaseComponent {

	get oddDay(): SwipeableDay {
		return this.oddSlide as SwipeableDay;
	}

	get evenDay(): SwipeableDay {
		return this.evenSlide as SwipeableDay;
	}

	get activeDay(): SwipeableDay {
		return this.activeSlide as SwipeableDay;
	}

	protected constructor(
		className: string,
		scheduleSateService: ScheduleStateService,
	) {
		super(className, scheduleSateService, 1);
	}

	override onDateChanged(changed: IDateChanged): void {
		const changedToLog = {...changed, date: dateToIso(changed.date)}
		console.log(`ScheduleDayBaseComponent.onDateChanged(), shiftDays=${this.shiftDays}, changed:`, changedToLog);
		if (this.shiftDays) {
			const d = changed.date;
			changed = {
				...changed,
				date: new Date(d.getFullYear(), d.getMonth(), d.getDate() + this.shiftDays),
			};
		}
		super.onDateChanged(changed);
	}
}
