import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { IHappeningWithUiState } from '@sneat/team/models';
import { ITeamContext } from '@sneat/team/models';
import { ScheduleFilterService } from '../schedule-filter.service';

@Component({
	selector: 'sneat-recurrings-tab',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: 'recurrings-tab.component.html',
})
export class RecurringsTabComponent {
	@Input() recurrings?: IHappeningWithUiState[];
	@Input() allRecurrings?: IHappeningWithUiState[];
	@Input() team?: ITeamContext;
	public readonly resetFilter: (event: Event) => void;

	public get numberOfHidden(): number {
		return (this.allRecurrings?.length || 0) - (this.recurrings?.length || 0);
	}

	constructor(
		filterService: ScheduleFilterService,
	) {
		this.resetFilter = filterService.resetFilterHandler;
	}

	readonly id = (i: number, v: { id: string }): string => v.id;
}
