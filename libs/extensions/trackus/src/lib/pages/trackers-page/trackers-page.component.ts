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

	protected goNewTracker(category?: string): void {
		console.log('goNewTracker', category);
		this.navController
			.navigateForward(this.spacePageUrl('trackers/new-tracker'), {
				queryParams: category ? { category } : undefined,
			})
			.catch(
				this.errorLogger.logErrorHandler(
					'Failed to navigate to new tracker page',
				),
			);
	}
}
