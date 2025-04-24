import { Component } from '@angular/core';
import {
	IonButtons,
	IonContent,
	IonHeader,
	IonMenuButton,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { SpacesCardComponent } from '@sneat/space-components';

@Component({
	selector: 'sneat-spaces-page',
	templateUrl: 'spaces-page.component.html',
	imports: [
		SpacesCardComponent,
		IonHeader,
		IonToolbar,
		IonButtons,
		IonTitle,
		IonContent,
		IonMenuButton,
	],
})
export class SpacesPageComponent {}
