import {
	Component,
	OnChanges,
	SimpleChange,
	SimpleChanges,
} from '@angular/core';
import { ISpaceContext } from '@sneat/team-models';

@Component({
	template: '',
	standalone: false,
})
export abstract class SpaceRelatedFormComponent implements OnChanges {
	// TODO: Needs to be in other place

	ngOnChanges(changes: SimpleChanges): void {
		const spaceChange = changes['space'];
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
		console.log('SpaceRelatedFormComponent.onSpaceTypeChanged()', team);
	}
}
