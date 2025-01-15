import { Component, Input } from '@angular/core';
import { ISpaceContext } from '@sneat/team-models';

// import { CalendarDayTabComponent } from '../calendar/components/calendar-day/calendar-day-tab.component';

@Component({
	selector: 'sneat-calendar-brief-card',
	templateUrl: './calendar-brief-card.component.html',
	// imports: [CalendarDayTabComponent],
})
export class CalendarBriefCardComponent {
	@Input() space?: ISpaceContext;
}
