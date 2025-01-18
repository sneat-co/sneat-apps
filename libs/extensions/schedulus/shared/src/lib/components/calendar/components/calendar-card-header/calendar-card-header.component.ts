import { Component, Input } from '@angular/core';

@Component({
	selector: 'sneat-calendar-card-header',
	templateUrl: 'calendar-card-header.component.html',
	standalone: false,
})
export class CalendarCardHeaderComponent {
	@Input() date = new Date();
	@Input() tab?: 'day' | 'week';

	// isCurrentWeek(): boolean {
	// 	const monday = this.activeWeek && this.activeWeek.startDate;
	// 	const today = new Date();
	// 	return !monday || monday.getTime() === getWeekdayDate(today, 0)
	// 		.getTime();
	// }
}
