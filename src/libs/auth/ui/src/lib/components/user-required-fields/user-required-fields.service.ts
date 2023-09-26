import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserRequiredFieldsModalComponent } from './user-required-fields-modal.component';

@Injectable()
export class UserRequiredFieldsService {

	constructor(
		private readonly modalController: ModalController,
	) {
	}

	public async open(): Promise<void> {
		const modal = await this.modalController.create({
			component: UserRequiredFieldsModalComponent,
		});
		await modal.present();
	}
}
