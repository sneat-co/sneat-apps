import { Component, Input } from '@angular/core';
import { ISlotItem, NewHappeningParams } from '../../view-models';
import { Weekday } from '../schedule-week/schedule-week.component';

@Component({
	selector: 'sneat-singles-tab',
	templateUrl: 'singles-tab.component.html',
})
export class SinglesTabComponent {
	@Input() todayAndFutureDays?: Weekday[];
	@Input() filter = '';
	@Input() onSlotClicked?: (slot: ISlotItem) => void;
	@Input() onDateSelected?: (date: Date) => void;
	@Input() goNewHappening?: (params: NewHappeningParams) => void;

	readonly trackByDate = (i: number, item: Weekday): number | undefined => item.day?.date.getTime();

}
