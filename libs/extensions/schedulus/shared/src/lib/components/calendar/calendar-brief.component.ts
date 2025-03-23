import { Component, Inject, SimpleChanges, OnChanges } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SneatApiService } from '@sneat/api';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { CalendarDayService } from '../../services/calendar-day.service';
import { CalendariumSpaceService } from '../../services/calendarium-space.service';
import { HappeningService } from '../../services/happening.service';
import { CalendariumServicesModule } from '../../services/calendarium-services.module';
import { createWeekday } from '../weekday-functions';
import { CalendarBaseComponent } from './calendar-base.component';
import { CalendarComponentModule } from './calendar-component.module';
import { CalendarAddButtonsComponent } from './components/calendar-add-buttons/calendar-add-buttons.component';
import { CalendarDayTitleComponent } from './components/calendar-day/calendar-day-title.component';
import { Weekday } from './weekday';

@Component({
	selector: 'sneat-calendar-brief',
	templateUrl: './calendar-brief.component.html',
	imports: [
		IonicModule,
		RouterLink,
		CalendarComponentModule,
		CalendarAddButtonsComponent,
		CalendariumServicesModule,
		CalendarDayTitleComponent,
	],
	providers: [],
})
export class CalendarBriefComponent
	extends CalendarBaseComponent
	implements OnChanges
{
	protected today?: Weekday;
	protected tomorrow?: Weekday;

	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		calendariumSpaceService: CalendariumSpaceService,
		happeningService: HappeningService,
		calendarDayService: CalendarDayService,
		sneatApiService: SneatApiService,
	) {
		super(
			'CalendarBriefComponent',
			errorLogger,
			calendariumSpaceService,
			happeningService,
			calendarDayService,
			sneatApiService,
		);

		const todayDate = new Date();
		this.today = createWeekday(todayDate, this.spaceDaysProvider);

		const tomorrowDate = new Date();
		tomorrowDate.setDate(todayDate.getDate() + 1);
		this.tomorrow = createWeekday(tomorrowDate, this.spaceDaysProvider);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected onDayChanged(d: Date): void {
		// do nothing
	}

	override onRecurringsLoaded(): void {
		// do nothing
	}

	override ngOnChanges(changes: SimpleChanges): void {
		super.ngOnChanges(changes);
	}
}
