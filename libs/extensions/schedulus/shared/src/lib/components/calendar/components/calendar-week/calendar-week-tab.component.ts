import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { WithSpaceInput } from '@sneat/space-services';
import { CalendarDataProvider } from '../../../../services/calendar-data-provider';
import { CalendarWeekCardComponent } from './calendar-week-card.component';

@Component({
	selector: 'sneat-week-tab',
	templateUrl: 'calendar-week-tab.component.html',
	imports: [CalendarWeekCardComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarWeekTabComponent extends WithSpaceInput {
	public readonly $spaceDaysProvider = input.required<CalendarDataProvider>();

	constructor() {
		super('CalendarWeekTabComponent');
	}
}
