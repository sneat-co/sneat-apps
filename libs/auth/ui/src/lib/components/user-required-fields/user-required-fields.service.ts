import { Injectable, inject } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { UserRequiredFieldsModalComponent } from './user-required-fields-modal.component';

@Injectable()
export class UserRequiredFieldsService {
	private readonly modalController = inject(ModalController);

	public async open(): Promise<boolean> {
		const modal = await this.modalController.create({
			component: UserRequiredFieldsModalComponent,
		});
		await modal.present();
		return new Promise((resolve, reject) => {
			modal
				.onDidDismiss()
				.then((value) => {
					console.log(
						'UserRequiredFieldsService.open(): modal dismissed:',
						value,
					);
					resolve(!!value);
				})
				.catch(reject);
		});
	}
}
