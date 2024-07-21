import {
	Component,
	OnChanges,
	SimpleChange,
	SimpleChanges,
} from '@angular/core';
import { ISpaceContext } from '@sneat/team-models';

@Component({ template: '' })
export abstract class SpaceRelatedFormComponent implements OnChanges {
	// TODO: Needs to be in other place

	ngOnChanges(changes: SimpleChanges): void {
		const spaceChange = changes['team'];
		if (spaceChange) {
			this.onSpaceChanged(spaceChange);
		}
	}

	protected onSpaceChanged(teamChange: SimpleChange): void {
		const previous = teamChange.previousValue as ISpaceContext | undefined;
		const current = teamChange.currentValue as ISpaceContext | undefined;
		if (previous?.type !== current?.type) {
			this.onSpaceTypeChanged(current);
		}
	}

	protected onSpaceTypeChanged(team?: ISpaceContext): void {
		console.log('TeamRelatedFormComponent.onSpaceTypeChanged()', team);
	}
}
