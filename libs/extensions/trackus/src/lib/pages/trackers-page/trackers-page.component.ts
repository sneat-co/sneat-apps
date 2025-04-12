import { Component } from '@angular/core';
import {
	IonBackButton,
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonLabel,
	IonMenuButton,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import {
	SpaceBaseComponent,
	SpaceComponentBaseParams,
} from '@sneat/space-components';
import { SpaceServiceModule } from '@sneat/space-services';
import { TrackersComponent } from '../../components';

@Component({
	selector: 'sneat-trackers-page',
	imports: [
		TrackersComponent,
		SpaceServiceModule,
		IonHeader,
		IonToolbar,
		IonButtons,
		IonBackButton,
		IonTitle,
		IonButton,
		IonIcon,
		IonLabel,
		IonMenuButton,
		IonContent,
	],
	templateUrl: './trackers-page.component.html',
	providers: [SpaceComponentBaseParams],
})
export class TrackersPageComponent extends SpaceBaseComponent {
	constructor() {
		super('TrackersPageComponent');
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
