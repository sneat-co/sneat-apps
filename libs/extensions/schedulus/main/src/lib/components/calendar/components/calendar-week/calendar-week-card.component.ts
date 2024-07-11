import {
	AfterViewInit,
	Component,
	EventEmitter,
	Inject,
	Input,
	Output,
} from '@angular/core';
import { virtualSliderAnimations } from '@sneat/components';
import { ISlotUIContext } from '@sneat/extensions/schedulus/shared';
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
})
export class CalendarWeekCardComponent
	extends SwipeableBaseComponent
	implements AfterViewInit
{
	@Input() team: ISpaceContext = { id: '' };
	@Input() teamDaysProvider?: SpaceDaysProvider;
	@Output() readonly slotClicked = new EventEmitter<{
		slot: ISlotUIContext;
		event: Event;
	}>();

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
		this.oddSlide = swipeableWeek(
			'odd',
			current,
			this.teamDaysProvider,
			this.destroyed$,
		);
		this.evenSlide = swipeableWeek(
			'even',
			next,
			this.teamDaysProvider,
			this.destroyed$,
		);
	}

	onSlotClicked(args: { slot: ISlotUIContext; event: Event }): void {
		console.log('ScheduleWeekCardComponent.onSlotClicked()', args);
		this.slotClicked.emit(args);
	}
}
