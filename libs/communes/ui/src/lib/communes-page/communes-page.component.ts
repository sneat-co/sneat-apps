import { Component } from '@angular/core';
import {
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonLabel,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';

@Component({
	selector: 'sneat-communes-page',
	templateUrl: './communes-page.component.html',
	imports: [
		IonHeader,
		IonToolbar,
		IonTitle,
		IonButtons,
		IonButton,
		IonIcon,
		IonLabel,
		IonContent,
	],
})
export class CommunesPageComponent {}
