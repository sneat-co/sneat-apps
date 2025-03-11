import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {
	SpaceBaseComponent,
	SpaceComponentBaseParams,
} from '@sneat/team-components';
import { TrackersComponent } from '../../components';

@Component({
	selector: 'sneat-trackers-page',
	imports: [CommonModule, IonicModule, TrackersComponent],
	templateUrl: './trackers-page.component.html',
})
export class TrackersPageComponent extends SpaceBaseComponent {
	constructor(route: ActivatedRoute, params: SpaceComponentBaseParams) {
		super('TrackersPageComponent', route, params);
	}

	override onSpaceIdChanged(): void {
		super.onSpaceIdChanged();
	}
}
