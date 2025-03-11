import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {
	SpaceBaseComponent,
	SpaceComponentBaseParams,
} from '@sneat/team-components';

@Component({
	selector: 'sneat-tracker-page',
	imports: [CommonModule, IonicModule],
	templateUrl: './tracker-page.component.html',
})
export class TrackerPageComponent extends SpaceBaseComponent {
	constructor(route: ActivatedRoute, params: SpaceComponentBaseParams) {
		super('TrackerPageComponent', route, params);
	}
}
