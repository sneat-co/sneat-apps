import { Component } from '@angular/core';
import { TeamDaysProvider } from '../../pages/schedule/team-days-provider';
import { getToday, ScheduleStateService } from '../schedule-state.service';
import { SwipeableBaseComponent } from '../swipeable-base.component';
import { swipeableWeek } from '../swipeable-ui';

@Component({
	selector: 'sneat-swipeable-week',
	templateUrl: 'schedule-week-card.component.html',
})
export class ScheduleWeekCardComponent extends SwipeableBaseComponent {
	constructor(
		private readonly scheduleStateService: ScheduleStateService,
		teamDaysProvider: TeamDaysProvider,
	) {
		super(scheduleStateService, 7);
		const current = getToday();
		const next = new Date();
		next.setDate(current.getDate() + 7);
		this.oddSlide = swipeableWeek('odd', current, teamDaysProvider, this.destroyed.asObservable());
		this.oddSlide = swipeableWeek('even', next, teamDaysProvider, this.destroyed.asObservable());
	}
}
