import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {
	SpaceBaseComponent,
	SpacePageBaseComponent,
} from '@sneat/team-components';
import { distinctUntilChanged, map } from 'rxjs';
import { TrackerComponent } from '../../components';

@Component({
	selector: 'sneat-tracker-page',
	imports: [CommonModule, IonicModule, TrackerComponent],
	templateUrl: './tracker-page.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TrackerPageComponent extends SpacePageBaseComponent {
	protected readonly $trackerID = signal<string | undefined>(undefined);

	constructor() {
		super('TrackerPageComponent');
		this.route.paramMap
			.pipe(
				map((p) => p.get('trackerID')),
				distinctUntilChanged(),
			)
			.subscribe((trackerID) => {
				// console.log(`TrackerPageComponent.paramsMap => trackerID=` + trackerID);
				this.$trackerID.set(trackerID || undefined);
			});
	}
}
