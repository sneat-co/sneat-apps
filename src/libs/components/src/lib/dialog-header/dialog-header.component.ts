import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
	selector: 'sneat-dialog-header',
	templateUrl: './dialog-header.component.html',
})
export class DialogHeaderComponent {
	@Input() dialogTitle = 'Dialog'; // Do not use just `title` as it conflicts with the HTML attribute.

	constructor(
		private readonly modalController: ModalController,
	) {
	}

	close(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		this.modalController.dismiss().catch(console.error);
	}

}
