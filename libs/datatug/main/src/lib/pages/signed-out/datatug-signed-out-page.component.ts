import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
	IonButton,
	IonCard,
	IonCardContent,
	IonContent,
	IonHeader,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';

@Component({
	selector: 'sneat-datatug-signed-out',
	templateUrl: './datatug-signed-out-page.component.html',
	imports: [
		IonHeader,
		IonToolbar,
		IonTitle,
		IonContent,
		IonCard,
		IonCardContent,
		IonButton,
		RouterLink,
	],
})
export class DatatugSignedOutPageComponent {}
