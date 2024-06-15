import { Injectable, NgModule } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import {
	IHappeningAdjustment,
	IHappeningSlot,
	IHappeningContext,
} from '@sneat/mod-schedulus-core';
import { HappeningSlotModalComponent } from './happening-slot-modal.component';

@Injectable()
export class HappeningSlotModalService {
	constructor(private readonly modalController: ModalController) {}

	async editSingleHappeningSlot(
		event: Event,
		happening: IHappeningContext,
		recurring?: {
			dateID: string;
			adjustment?: IHappeningAdjustment;
		},
		slot?: IHappeningSlot,
	): Promise<void> {
		console.log('editSingleHappeningSlot', happening, recurring, slot);
		event.stopPropagation();
		event.preventDefault();
		const team = happening.team;
		if (!team) {
			return Promise.reject('no team context');
		}
		const modal = await this.modalController.create({
			component: HappeningSlotModalComponent,
			componentProps: {
				team,
				happening,
				slot,
				adjustment: recurring?.adjustment,
				dateID: recurring?.dateID,
				isModal: true,
			},
		});
		await modal.present();
	}
}

@NgModule({
	providers: [HappeningSlotModalService],
})
export class HappeningSlotModalServiceModule {}
