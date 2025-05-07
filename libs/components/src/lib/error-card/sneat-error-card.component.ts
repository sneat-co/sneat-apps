import { JsonPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
	IonCard,
	IonCardContent,
	IonCardHeader,
	IonCardTitle,
	IonItem,
	IonTextarea,
} from '@ionic/angular/standalone';

@Component({
	selector: 'sneat-datatug-error-card',
	templateUrl: './sneat-error-card.component.html',
	imports: [
		IonCard,
		IonCardHeader,
		IonCardTitle,
		IonCardContent,
		IonItem,
		IonTextarea,
		JsonPipe,
	],
})
export class SneatErrorCardComponent {
	@Input()
	error?: { message?: string };
}
