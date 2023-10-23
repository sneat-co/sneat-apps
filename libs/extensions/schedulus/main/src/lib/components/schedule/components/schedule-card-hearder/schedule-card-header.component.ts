import { Component, Input } from '@angular/core';

@Component({
	selector: 'sneat-schedule-card-header',
	templateUrl: 'schedule-card-header.component.html',
})
export class ScheduleCardHeaderComponent {
	@Input() date = new Date();
	@Input() tab?: 'day' | 'week';

	// isCurrentWeek(): boolean {
	// 	const monday = this.activeWeek && this.activeWeek.startDate;
	// 	const today = new Date();
	// 	return !monday || monday.getTime() === getWeekdayDate(today, 0)
	// 		.getTime();
	// }
}
