import {
	Component,
	OnChanges,
	SimpleChange,
	SimpleChanges,
} from '@angular/core';
import { ISpaceContext } from '@sneat/team-models';

@Component({ template: '' })
export abstract class TeamRelatedFormComponent implements OnChanges {
	// TODO: Needs to be in other place

	ngOnChanges(changes: SimpleChanges): void {
		const teamChange = changes['team'];
		if (teamChange) {
			this.onTeamChanged(teamChange);
		}
	}

	protected onTeamChanged(teamChange: SimpleChange): void {
		const previous = teamChange.previousValue as ISpaceContext | undefined;
		const current = teamChange.currentValue as ISpaceContext | undefined;
		if (previous?.type !== current?.type) {
			this.onTeamTypeChanged(current);
		}
	}

	protected onTeamTypeChanged(team?: ISpaceContext): void {
		console.log('TeamRelatedFormComponent.onTeamTypeChanged()', team);
	}
}
