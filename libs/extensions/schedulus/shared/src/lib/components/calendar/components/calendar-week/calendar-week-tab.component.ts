import { Component, Input } from '@angular/core';
import { ISpaceContext } from '@sneat/space-models';
import { CalendarDaysProvider } from '../../../../services/calendar-days-provider';
import { CalendarWeekCardComponent } from './calendar-week-card.component';

@Component({
	selector: 'sneat-week-tab',
	templateUrl: 'calendar-week-tab.component.html',
	imports: [CalendarWeekCardComponent],
})
export class CalendarWeekTabComponent {
	@Input({ required: true }) space?: ISpaceContext;
	@Input({ required: true }) spaceDaysProvider?: CalendarDaysProvider;
}
