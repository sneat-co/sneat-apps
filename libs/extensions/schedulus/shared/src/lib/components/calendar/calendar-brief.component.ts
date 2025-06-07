import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IonCard, IonIcon, IonItem, IonLabel } from '@ionic/angular/standalone';
import { ClassName } from '@sneat/ui';
import { CalendarDayServiceModule } from '../../services/calendar-day.service';
import { HappeningServiceModule } from '../../services/happening.service';
import { CalendariumServicesModule } from '../../services/calendarium-services.module';
import { CalendarFilterService } from '../calendar-filter.service';
import { createWeekday } from '../weekday-functions';
import { CalendarBaseComponent } from './calendar-base.component';
import { CalendarAddButtonsComponent } from './components/calendar-add-buttons/calendar-add-buttons.component';
import { CalendarDayTitleComponent } from './components/calendar-day/calendar-day-title.component';
import { CalendarDayComponent } from './components/calendar-day/calendar-day.component';
import { Weekday } from './weekday';

@Component({
	imports: [
		RouterLink,
		CalendarAddButtonsComponent,
		CalendariumServicesModule,
		CalendarDayTitleComponent,
		HappeningServiceModule,
		CalendarDayServiceModule,
		CalendarDayComponent,
		IonCard,
		IonItem,
		IonIcon,
		IonLabel,
	],
	providers: [
		CalendarFilterService,
		{ provide: ClassName, useValue: 'CalendarBriefComponent' },
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'sneat-calendar-brief',
	templateUrl: './calendar-brief.component.html',
})
export class CalendarBriefComponent extends CalendarBaseComponent {
	protected readonly $today = signal<Weekday | undefined>(undefined);
	protected readonly $tomorrow = signal<Weekday | undefined>(undefined);

	public constructor() {
		super();

		const todayDate = new Date();
		const today = createWeekday(todayDate, this.spaceDaysProvider);
		this.$today.set(today);

		const tomorrowDate = new Date();
		tomorrowDate.setDate(todayDate.getDate() + 1);
		const tomorrow = createWeekday(tomorrowDate, this.spaceDaysProvider);
		this.$tomorrow.set(tomorrow);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	protected onDayChanged(d: Date): void {
		// do nothing
	}
}
