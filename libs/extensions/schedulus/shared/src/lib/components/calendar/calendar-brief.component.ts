import { Component } from '@angular/core';
import { Inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SneatApiService } from '@sneat/api';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	CalendarDayService,
	CalendarDayServiceModule,
} from '../../services/calendar-day.service';
import { CalendariumSpaceService } from '../../services/calendarium-space.service';
import {
	HappeningService,
	HappeningServiceModule,
} from '../../services/happening.service';
import { CalendariumServicesModule } from '../../services/calendarium-services.module';
import { CalendarFilterService } from '../calendar-filter.service';
import { createWeekday } from '../weekday-functions';
import { CalendarBaseComponent } from './calendar-base.component';
import { CalendarAddButtonsComponent } from './components/calendar-add-buttons/calendar-add-buttons.component';
import { CalendarDayTitleComponent } from './components/calendar-day/calendar-day-title.component';
import { CalendarDayComponent } from './components/calendar-day/calendar-day.component';
import { Weekday } from './weekday';

@Component({
	selector: 'sneat-calendar-brief',
	templateUrl: './calendar-brief.component.html',
	imports: [
		IonicModule,
		RouterLink,
		CalendarAddButtonsComponent,
		CalendariumServicesModule,
		CalendarDayTitleComponent,
		HappeningServiceModule,
		CalendarDayServiceModule,
		CalendarDayComponent,
	],
	providers: [CalendarFilterService],
})
export class CalendarBriefComponent extends CalendarBaseComponent {
	protected today?: Weekday;
	protected tomorrow?: Weekday;

	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		sneatApiService: SneatApiService,
		calendarDayService: CalendarDayService,
		happeningService: HappeningService,
		calendariumSpaceService: CalendariumSpaceService,
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
}
