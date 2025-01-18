import { Component, Inject, Input } from '@angular/core';
import { virtualSliderAnimations } from '@sneat/components';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/team-models';
import { SpaceDaysProvider } from '../../../../services/space-days-provider';
import { getToday, CalendarStateService } from '../../calendar-state.service';
import { SwipeableBaseComponent } from '../../../swipeable-base.component';
import { SwipeableWeek, swipeableWeek } from '../../../swipeable-ui';

@Component({
	selector: 'sneat-week-card',
	templateUrl: 'calendar-week-card.component.html',
	animations: virtualSliderAnimations,
	standalone: false,
})
// implements OnInit
export class CalendarWeekCardComponent extends SwipeableBaseComponent {
	@Input({ required: true }) space?: ISpaceContext;
	@Input({ required: true }) spaceDaysProvider?: SpaceDaysProvider;

	get oddWeek(): SwipeableWeek {
		return this.oddSlide as SwipeableWeek;
	}

	get evenWeek(): SwipeableWeek {
		return this.evenSlide as SwipeableWeek;
	}

	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		scheduleStateService: CalendarStateService,
	) {
		super('ScheduleWeekCardComponent', errorLogger, scheduleStateService, 7);
		setTimeout(() => (this.isEvenSlideActivated = true), 500);
	}

	// ngOnInit(): void {
	// 	if (this.spaceDaysProvider) {
	// 		this.createSlides();
	// 	}
	// }

	private createSlides(): void {
		// if (!this.spaceDaysProvider) {
		// 	return;
		// }
		const current = getToday();
		const next = new Date();
		next.setDate(current.getDate() + 7);
		this.oddSlide = swipeableWeek(
			'odd',
			current,
			// this.spaceDaysProvider,
			this.destroyed$,
		);
		this.evenSlide = swipeableWeek(
			'even',
			next,
			// this.spaceDaysProvider,
			this.destroyed$,
		);
	}
}