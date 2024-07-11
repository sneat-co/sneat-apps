import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ISpaceContext } from '@sneat/team-models';
import { SpaceDaysProvider } from '../../../../services/space-days-provider';
import { ISlotUIContext } from '@sneat/extensions/schedulus/shared';

@Component({
	selector: 'sneat-week-tab',
	templateUrl: 'calendar-week-tab.component.html',
})
export class CalendarWeekTabComponent {
	@Input() team: ISpaceContext = { id: '' };
	@Input() teamDaysProvider?: SpaceDaysProvider;
	@Output() readonly slotClicked = new EventEmitter<{
		slot: ISlotUIContext;
		event: Event;
	}>();

	onSlotClicked(args: { slot: ISlotUIContext; event: Event }): void {
		console.log('ScheduleWeekTabComponent.onSlotClicked()', args);
		this.slotClicked.emit(args);
	}
}
