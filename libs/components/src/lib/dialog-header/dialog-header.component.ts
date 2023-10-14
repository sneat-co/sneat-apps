import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';

@Component({
	selector: 'sneat-dialog-header',
	templateUrl: './dialog-header.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule],
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
