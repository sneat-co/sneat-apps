import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
	IonButton,
	IonButtons,
	IonCard,
	IonIcon,
	IonItem,
	IonLabel,
} from '@ionic/angular/standalone';
import { virtualSliderAnimations } from '@sneat/components';
import { CalendarDayComponent } from './calendar-day.component';
import { CalendarDayTitleComponent } from './calendar-day-title.component';
import { ISpaceContext } from '@sneat/space-models';
import { CalendarDataProvider } from '../../../../services/calendar-data-provider';
import { NewHappeningParams } from '@sneat/mod-schedulus-core';
import { getToday, CalendarStateService } from '../../calendar-state.service';
import { swipeableDay } from '../../../swipeable-ui';
import { CalendarAddButtonsComponent } from '../calendar-add-buttons/calendar-add-buttons.component';
import { CalendarDayBaseComponent } from './calendar-day-base.component';

// This is 1 of the 2 "day cards" used at ScheduleDayTabComponent
// The 1st is the "active day" (e.g. today), and the 2nd is "next day" (e.g. tomorrow).
// The 2nd should set the [activeDayPlus]="1"
@Component({
	selector: 'sneat-calendar-day-card',
	templateUrl: 'calendar-day-card.component.html',
	animations: virtualSliderAnimations,
	imports: [
		CalendarDayComponent,
		CalendarAddButtonsComponent,
		CalendarDayTitleComponent,
		IonCard,
		IonItem,
		IonButtons,
		IonButton,
		IonIcon,
		IonLabel,
	],
})
export class CalendarDayCardComponent
	extends CalendarDayBaseComponent
	implements OnInit
{
	@Input({ required: true }) space?: ISpaceContext;
	@Input({ required: true }) spaceDaysProvider?: CalendarDataProvider;

	@Output() readonly goNew = new EventEmitter<NewHappeningParams>();

	@Input() set activeDayPlus(value: number) {
		this.shiftDays = value;
		console.log('set activeDayPlus()', value, 'shiftDays=', this.shiftDays);
	}

	constructor(
		scheduleSateService: CalendarStateService,
		// private readonly spaceDaysProvider: SpaceDaysProvider,
	) {
		super('ScheduleDayCardComponent', scheduleSateService);
	}

	public ngOnInit(): void {
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
		this.$date.set(current);
		const next = new Date();
		next.setDate(current.getDate() + 1);
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
