import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITeamContext } from '@sneat/team-models';
import { TeamDaysProvider } from '../../../../services/team-days-provider';
import { ISlotUIContext } from '@sneat/extensions/schedulus/shared';

@Component({
	selector: 'sneat-week-tab',
	templateUrl: 'calendar-week-tab.component.html',
})
export class CalendarWeekTabComponent {
	@Input() team: ITeamContext = { id: '' };
	@Input() teamDaysProvider?: TeamDaysProvider;
	@Output() readonly slotClicked = new EventEmitter<{
		slot: ISlotUIContext;
		event: Event;
	}>();

	onSlotClicked(args: { slot: ISlotUIContext; event: Event }): void {
		console.log('ScheduleWeekTabComponent.onSlotClicked()', args);
		this.slotClicked.emit(args);
	}
}
