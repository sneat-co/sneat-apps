import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ISlotItem } from '../../view-models';
import { isSlotVisible } from '../schedile-slots';
import { Weekday } from '../schedule-week/schedule-week.component';

@Component({
	selector: 'sneat-schedule-day',
	templateUrl: './schedule-day.component.html',
})
export class ScheduleDayComponent {

	@Input() filter = '';
	@Input() showRegulars = true;
	@Input() showEvents = true;
	@Input() weekday?: Weekday;

	@Output() readonly slotClicked = new EventEmitter<ISlotItem>();

	showSlot(slot: ISlotItem): boolean {
		return isSlotVisible(slot, this.filter, this.showRegulars, this.showEvents);
	}

	byIndex(index: number/*, item: SlotItem*/): number {
		return index;
		// return item.kind + item.time.weekdays.join('') + item.time.starts + (item.time.ends || '');
	}
}
