import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { SpaceBaseComponent } from '@sneat/team-components';
import { TrackersComponent } from '../../components';

@Component({
	selector: 'sneat-trackers-page',
	imports: [CommonModule, IonicModule, TrackersComponent],
	templateUrl: './trackers-page.component.html',
})
export class TrackersPageComponent extends SpaceBaseComponent {
	constructor() {
		super('TrackersPageComponent');
	}

	override onSpaceIdChanged(): void {
		super.onSpaceIdChanged();
	}
}
