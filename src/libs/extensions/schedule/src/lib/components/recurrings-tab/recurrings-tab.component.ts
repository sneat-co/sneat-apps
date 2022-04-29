import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IHappeningWithUiState } from '@sneat/dto';
import { ITeamContext } from '@sneat/team/models';
import { IScheduleFilter } from '../schedule-filter/schedule-filter';

@Component({
	selector: 'sneat-recurrings-tab',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: 'recurrings-tab.component.html',
})
export class RecurringsTabComponent {
	@Input() filter?: IScheduleFilter;
	@Input() recurrings?: IHappeningWithUiState[];
	@Input() allRecurrings?: IHappeningWithUiState[];
	@Input() team?: ITeamContext;

	@Output() resetFilter = new EventEmitter<Event>();

	public get numberOfHidden(): number {
		return (this.allRecurrings?.length || 0) - (this.recurrings?.length || 0)
	}
	readonly id = (i: number, v: { id: string }): string => v.id;
}
