import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ISpaceContext } from '@sneat/team-models';
import { CalendarAddButtonsComponent } from '../calendar/components/calendar-add-buttons/calendar-add-buttons.component';

// import { CalendarDayTabComponent } from '../calendar/components/calendar-day/calendar-day-tab.component';

@Component({
	selector: 'sneat-calendar-brief-card',
	templateUrl: './calendar-brief-card.component.html',
	imports: [IonicModule, RouterModule, CalendarAddButtonsComponent],
})
export class CalendarBriefCardComponent {
	@Input({ required: true }) space?: ISpaceContext;
}
