import { AfterViewInit, Component, Input } from '@angular/core';
import { virtualSliderAnimations } from '@sneat/components';
import { ITeamContext } from '@sneat/team/models';
import { TeamDaysProvider } from '../../pages/schedule/team-days-provider';
import { getToday, ScheduleStateService } from '../schedule-state.service';
import { SwipeableBaseComponent } from '../swipeable-base.component';
import { SwipeableWeek, swipeableWeek } from '../swipeable-ui';

@Component({
	selector: 'sneat-week-card',
	templateUrl: 'schedule-week-card.component.html',
	animations: virtualSliderAnimations,
})
export class ScheduleWeekCardComponent extends SwipeableBaseComponent implements AfterViewInit {

	@Input() team?: ITeamContext;
	@Input() teamDaysProvider?: TeamDaysProvider;

	get oddWeek(): SwipeableWeek {
		return this.oddSlide as SwipeableWeek;
	}

	get evenWeek(): SwipeableWeek {
		return this.evenSlide as SwipeableWeek;
	}


	constructor(
		private readonly scheduleStateService: ScheduleStateService,
	) {
		super('ScheduleWeekCardComponent', scheduleStateService, 7);
	}

	ngAfterViewInit(): void {
		if (this.teamDaysProvider) {
			this.createSlides();
		}
	}

	private createSlides(): void {
		if (!this.teamDaysProvider) {
			return;
		}
		const current = getToday();
		const next = new Date();
		next.setDate(current.getDate() + 7);
		this.oddSlide = swipeableWeek('odd', current, this.teamDaysProvider, this.destroyed.asObservable());
		this.evenSlide = swipeableWeek('even', next, this.teamDaysProvider, this.destroyed.asObservable());
	}
}
