import { Component, Input } from '@angular/core';
import {
	IonCard,
	IonCardHeader,
	IonCardTitle,
	IonCheckbox,
	IonIcon,
	IonItem,
	IonLabel,
	IonSelect,
	IonSelectOption,
	IonToggle,
} from '@ionic/angular/standalone';

@Component({
	selector: 'sneat-shared-with',
	templateUrl: './shared-with.component.html',
	imports: [
		IonCard,
		IonCardHeader,
		IonItem,
		IonLabel,
		IonSelect,
		IonSelectOption,
		IonCardTitle,
		IonCheckbox,
		IonToggle,
		IonIcon,
	],
})
export class SharedWithComponent {
	@Input() title?: string;
}
