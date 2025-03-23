import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import {
	IonBackButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonMenuButton,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import {
	SpaceComponentBaseParams,
	SpacePageBaseComponent,
} from '@sneat/team-components';
import { SpaceServiceModule } from '@sneat/team-services';
import { distinctUntilChanged, map } from 'rxjs';
import { TrackerComponent } from '../../components';

@Component({
	selector: 'sneat-tracker-page',
	imports: [
		TrackerComponent,
		IonHeader,
		IonToolbar,
		IonButtons,
		IonBackButton,
		IonTitle,
		IonMenuButton,
		IonContent,
		SpaceServiceModule,
	],
	templateUrl: './tracker-page.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [SpaceComponentBaseParams],
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
