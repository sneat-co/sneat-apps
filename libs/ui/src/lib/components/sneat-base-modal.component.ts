import { inject, Injectable } from '@angular/core';
import { SneatBaseComponent } from './sneat-base.component';
import { ModalController } from '@ionic/angular';

@Injectable()
export abstract class SneatBaseModalComponent extends SneatBaseComponent {
	protected readonly modalController = inject(ModalController);

	protected close(): void {
		this.modalController
			.dismiss()
			.catch(this.errorLogger.logErrorHandler('Failed to close modal'));
	}
}
