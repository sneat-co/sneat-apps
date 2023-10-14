import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITeamContext } from '@sneat/team/models';
import { TeamDaysProvider } from '../../pages/schedule/team-days-provider';
import { ISlotItem } from '@sneat/extensions/schedulus/shared';

@Component({
	selector: 'sneat-week-tab',
	templateUrl: 'schedule-week-tab.component.html',
})
export class ScheduleWeekTabComponent {
	@Input() team: ITeamContext = { id: '' };
	@Input() teamDaysProvider?: TeamDaysProvider;
	@Output() readonly slotClicked = new EventEmitter<{ slot: ISlotItem; event: Event }>();

	onSlotClicked(args: { slot: ISlotItem; event: Event }): void {
		console.log('ScheduleWeekTabComponent.onSlotClicked()', args);
		this.slotClicked.emit(args);
	};
}
