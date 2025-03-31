import { Component, input, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { virtualSliderAnimations } from '@sneat/components';
import { ISpaceContext } from '@sneat/space-models';
import { SpaceDaysProvider } from '../../../../services/space-days-provider';
import { getToday, CalendarStateService } from '../../calendar-state.service';
import { SwipeableBaseComponent } from '../../../swipeable-base.component';
import { SwipeableWeek, swipeableWeek } from '../../../swipeable-ui';
import { CalendarWeekTitleComponent } from './calendar-week-title.component';
import { CalendarWeekComponent } from './calendar-week.component';

@Component({
	selector: 'sneat-week-card',
	templateUrl: 'calendar-week-card.component.html',
	animations: virtualSliderAnimations,
	imports: [IonicModule, CalendarWeekComponent, CalendarWeekTitleComponent],
})
// implements OnInit
export class CalendarWeekCardComponent extends SwipeableBaseComponent {
	public readonly $space = input.required<ISpaceContext | undefined>();
	@Input({ required: true }) spaceDaysProvider?: SpaceDaysProvider;

	get oddWeek(): SwipeableWeek {
		return this.oddSlide as SwipeableWeek;
	}

	get evenWeek(): SwipeableWeek {
		return this.evenSlide as SwipeableWeek;
	}

	constructor(scheduleStateService: CalendarStateService) {
		super('ScheduleWeekCardComponent', scheduleStateService, 7);

		this.createSlides();

		// Delay creation of the non-active slide for performance reasons
		setTimeout(() => (this.isEvenSlideActivated = true), 500);
	}

	private createSlides(): void {
		const current = getToday();
		const next = new Date();
		next.setDate(current.getDate() + 7);
		this.oddSlide = swipeableWeek('odd', current, this.destroyed$);
		this.evenSlide = swipeableWeek('even', next, this.destroyed$);
	}
}
