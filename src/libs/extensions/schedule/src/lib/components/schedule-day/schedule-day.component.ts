import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SlotItem, SlotsGroup} from '../../view-models';
import {isSlotVisible} from '../schedile-slots';

@Component({
	selector: 'app-schedule-day',
	templateUrl: './schedule-day.component.html',
})
export class ScheduleDayComponent {

	@Input() filter: string;
	@Input() showRegulars = true;
	@Input() showEvents = true;

	@Input() dayWeekday: SlotsGroup;
	@Output() slotClicked = new EventEmitter<SlotItem>();

	showSlot(slot: SlotItem): boolean {
		return isSlotVisible(slot, this.filter, this.showRegulars, this.showEvents);
	}

	// noinspection JSMethodCanBeStatic
	// tslint:disable-next-line:prefer-function-over-method
	trackByIndex(index: number/*, item: SlotItem*/): number {
		return index;
		// return item.kind + item.time.weekdays.join('') + item.time.starts + (item.time.ends || '');
	}
}
