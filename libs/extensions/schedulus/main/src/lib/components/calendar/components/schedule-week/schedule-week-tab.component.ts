import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITeamContext } from '@sneat/team-models';
import { TeamDaysProvider } from '../../../../pages/calendar/team-days-provider';
import { IHappeningSlotUiItem } from '@sneat/extensions/schedulus/shared';

@Component({
	selector: 'sneat-week-tab',
	templateUrl: 'schedule-week-tab.component.html',
})
export class ScheduleWeekTabComponent {
	@Input() team: ITeamContext = { id: '' };
	@Input() teamDaysProvider?: TeamDaysProvider;
	@Output() readonly slotClicked = new EventEmitter<{
		slot: IHappeningSlotUiItem;
		event: Event;
	}>();

	onSlotClicked(args: { slot: IHappeningSlotUiItem; event: Event }): void {
		console.log('ScheduleWeekTabComponent.onSlotClicked()', args);
		this.slotClicked.emit(args);
	}
}
