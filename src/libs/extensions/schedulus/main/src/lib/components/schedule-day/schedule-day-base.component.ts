import { dateToIso } from '@sneat/core';
import { IErrorLogger } from '@sneat/logging';
import { IDateChanged, ScheduleStateService } from '../schedule-state.service';
import { SwipeableBaseComponent } from '../swipeable-base.component';
import { SwipeableDay } from '../swipeable-ui';

export abstract class ScheduleDayBaseComponent extends SwipeableBaseComponent {

	get oddDay(): SwipeableDay | undefined {
		return this.oddSlide as SwipeableDay || undefined;
	}

	get evenDay(): SwipeableDay | undefined {
		return this.evenSlide as SwipeableDay || undefined;
	}

	get activeDay(): SwipeableDay | undefined {
		return this.activeSlide as SwipeableDay || undefined;
	}

	protected constructor(
		className: string,
		errorLogger: IErrorLogger,
		scheduleSateService: ScheduleStateService,
	) {
		super(className, errorLogger, scheduleSateService, 1);
	}

	override onDateChanged(changed: IDateChanged): void {
		const changedToLog = { ...changed, date: dateToIso(changed.date) };
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
