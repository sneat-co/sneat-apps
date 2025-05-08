import { Component, Input } from '@angular/core';
import {
	ModalController,
	IonButton,
	IonButtons,
	IonIcon,
	IonItem,
	IonLabel,
} from '@ionic/angular/standalone';

@Component({
	selector: 'sneat-dialog-header',
	templateUrl: './dialog-header.component.html',
	imports: [IonItem, IonLabel, IonButtons, IonButton, IonIcon],
})
export class DialogHeaderComponent {
	@Input() dialogTitle = 'Dialog'; // Do not use just `title` as it conflicts with the HTML attribute.

	constructor(private readonly modalController: ModalController) {}

	close(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		this.modalController.dismiss().catch(console.error);
	}
}
