import { Component, Input } from '@angular/core';
import { ITeamContext } from '@sneat/team/models';
import { TeamDaysProvider } from '../../pages/schedule/team-days-provider';
import { ISlotItem } from '../../view-models';

@Component({
	selector: 'sneat-week-tab',
	templateUrl: 'schedule-week-tab.component.html',
})
export class ScheduleWeekTabComponent {
	@Input() team?: ITeamContext;
	@Input() teamDaysProvider?: TeamDaysProvider;
	@Input() onSlotClicked?: (slot: ISlotItem) => void = (_: ISlotItem) => {
		throw new Error('onSlotClicked not set');
	};

}
