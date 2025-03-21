import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {
	SpaceBaseComponent,
	SpaceComponentBaseParams,
} from '@sneat/team-components';
import { TrackerComponent } from '../../components';

@Component({
	selector: 'sneat-new-tracker',
	templateUrl: './new-tracker.html',
	imports: [IonicModule, TrackerComponent],
})
export class NewTrackerPageComponent extends SpaceBaseComponent {
	constructor(params: SpaceComponentBaseParams) {
		super('NewTrackerPage', params);
	}
}
