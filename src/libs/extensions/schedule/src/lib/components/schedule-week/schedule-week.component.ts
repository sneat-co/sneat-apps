import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NewHappeningParams, SlotItem, SlotsGroup} from '../../view-models';
import {Weekday} from '../../../../models/types';

@Component({
	selector: 'app-schedule-week',
	templateUrl: './schedule-week.component.html',
})
export class ScheduleWeekComponent {

	@Input() filter: string;
	@Input() showRegulars = true;
	@Input() showEvents = true;
	@Output() goNew = new EventEmitter<NewHappeningParams>();
	@Output() dateSelected = new EventEmitter<Date>();
	@Output() slotClicked = new EventEmitter<SlotItem>();
	@Input() weekdays: SlotsGroup[];

	// noinspection JSMethodCanBeStatic
	// tslint:disable-next-line:prefer-function-over-method
	trackByWd(i: number, item: SlotsGroup): Weekday {
		return item.wd;
	}
}
