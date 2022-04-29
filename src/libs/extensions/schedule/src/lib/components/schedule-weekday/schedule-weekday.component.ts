import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITeamContext } from '@sneat/team/models';
import { ISlotItem, NewHappeningParams } from '../../view-models';
import { IScheduleFilter } from '../schedule-filter/schedule-filter';
import { isSlotVisible } from '../schedule-slots';
import { Weekday } from '../schedule-week/schedule-week.component';

@Component({
	selector: 'sneat-schedule-weekday',
	templateUrl: './schedule-weekday.component.html',
})
export class ScheduleWeekdayComponent {
	@Input() team?: ITeamContext;
	@Input() weekday?: Weekday;
	@Input() filter?: IScheduleFilter;
	@Input() showRegulars = true;
	@Input() showEvents = true;
	@Output() goNew = new EventEmitter<NewHappeningParams>();
	@Output() dateSelected = new EventEmitter<Date>();
	@Output() slotClicked = new EventEmitter<ISlotItem>();

	public get day() {
		return this.weekday?.day;
	}

	// public readonly id = (_: number, v: {id: string}) => v.id;

	showSlot(slot: ISlotItem): boolean {
		return isSlotVisible(slot, this.filter || {text: ''}, this.showRegulars, this.showEvents);
	}

	onDateSelected(): void {
		// console.log('onDateSelected', event);
		if (this.weekday?.day?.date) {
			this.dateSelected.next(this.weekday?.day?.date);
		}
	}
}
