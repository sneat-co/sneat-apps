import {
	Component,
	EventEmitter,
	Inject,
	Input,
	OnInit,
	Output,
} from '@angular/core';
import { virtualSliderAnimations } from '@sneat/components';
import { HappeningType } from '@sneat/mod-schedulus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/team-models';
import { SpaceDaysProvider } from '../../../../services/space-days-provider';
import { ScheduleNavService } from '@sneat/extensions/schedulus/shared';
import {
	ISlotUIContext,
	NewHappeningParams,
} from '@sneat/extensions/schedulus/shared';
import { getToday, CalendarStateService } from '../../calendar-state.service';
import { swipeableDay } from '../../../swipeable-ui';
import { CalendarDayBaseComponent } from './calendar-day-base.component';

// This is 1 of the 2 "day cards" used at ScheduleDayTabComponent
// The 1st is the "active day" (e.g. today), and the 2nd is "next day" (e.g. tomorrow).
// The 2nd should set the [activeDayPlus]="1"
@Component({
	selector: 'sneat-calendar-day-card',
	templateUrl: 'calendar-day-card.component.html',
	animations: virtualSliderAnimations,
	standalone: false,
})
export class CalendarDayCardComponent
	extends CalendarDayBaseComponent
	implements OnInit
{
	@Input({ required: true }) space: ISpaceContext = { id: '' };
	@Input({ required: true }) spaceDaysProvider?: SpaceDaysProvider;
	@Output() goNew = new EventEmitter<NewHappeningParams>();

	@Input() set activeDayPlus(value: number) {
		this.shiftDays = value;
		console.log('set activeDayPlus()', value, 'shiftDays=', this.shiftDays);
	}

	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		scheduleSateService: CalendarStateService,
		private readonly scheduleNavService: ScheduleNavService, // private readonly teamDaysProvider: TeamDaysProvider,
	) {
		super('ScheduleDayCardComponent', errorLogger, scheduleSateService);
	}

	@Input() onSlotClicked?: (args: {
		slot: ISlotUIContext;
		event: Event;
	}) => void = () => {
		throw new Error('onSlotClicked not set');
	};

	ngOnInit(): void {
		// console.log('ngOnInit(), shiftDays=', this.shiftDays);
		if (this.shiftDays < 0) {
			throw new Error('shiftDays < 0');
		}
		this.createSlides();
	}

	private createSlides(): void {
		if (!this.spaceDaysProvider) {
			throw new Error('!this.teamDaysProvider');
		}
		const current = getToday();
		if (this.activeDayPlus) {
			current.setDate(current.getDate() + this.activeDayPlus);
		}
		this.date = current;
		const next = new Date();
		next.setDate(this.date.getDate() + 1);
		this.oddSlide = swipeableDay(
			'odd',
			current,
			this.spaceDaysProvider,
			this.destroyed$,
		);
		this.evenSlide = swipeableDay(
			'even',
			next,
			this.spaceDaysProvider,
			this.destroyed$,
		);
		this.onDateChanged({ date: current, shiftDirection: '' });
	}
}
