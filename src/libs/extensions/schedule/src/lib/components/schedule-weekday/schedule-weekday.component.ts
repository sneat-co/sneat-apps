import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NewHappeningParams, SlotItem, SlotsGroup} from '../../view-models';
import {isSlotVisible} from '../schedile-slots';

@Component({
	selector: 'app-schedule-weekday',
	templateUrl: './schedule-weekday.component.html',
})
export class ScheduleWeekdayComponent {

	@Input() weekday: SlotsGroup;
	@Input() filter: string;
	@Input() showRegulars = true;
	@Input() showEvents = true;
	@Output() goNew = new EventEmitter<NewHappeningParams>();
	@Output() dateSelected = new EventEmitter<Date>();
	@Output() slotClicked = new EventEmitter<SlotItem>();

	showSlot(slot: SlotItem): boolean {
		return isSlotVisible(slot, this.filter, this.showRegulars, this.showEvents);
	}
}
