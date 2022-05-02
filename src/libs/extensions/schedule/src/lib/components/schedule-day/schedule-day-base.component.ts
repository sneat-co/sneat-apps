import { TeamDaysProvider } from '../../pages/schedule/team-days-provider';
import { ScheduleStateService } from '../schedule-state.service';
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
		scheduleSateService: ScheduleStateService,
	) {
		super(scheduleSateService, 1);
	}
}
