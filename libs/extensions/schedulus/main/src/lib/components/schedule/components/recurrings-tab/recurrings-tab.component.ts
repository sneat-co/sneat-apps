import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IHappeningWithUiState } from '@sneat/mod-schedulus-core';
import { ITeamContext } from '@sneat/team-models';
import { ScheduleFilterService } from '../../../schedule-filter.service';

@Component({
	selector: 'sneat-recurrings-tab',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: 'recurrings-tab.component.html',
})
export class RecurringsTabComponent {
	@Input() recurrings?: IHappeningWithUiState[];
	@Input() allRecurrings?: IHappeningWithUiState[];
	@Input() team: ITeamContext = { id: '' };
	public readonly resetFilter: (event: Event) => void;

	public get numberOfHidden(): number {
		return (this.allRecurrings?.length || 0) - (this.recurrings?.length || 0);
	}

	constructor(filterService: ScheduleFilterService) {
		this.resetFilter = filterService.resetFilterHandler;
	}

	protected readonly id = (_: number, o: IHappeningWithUiState) => o.id;
}
