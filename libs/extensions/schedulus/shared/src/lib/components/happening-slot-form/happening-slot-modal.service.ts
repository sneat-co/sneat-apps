import { Injectable, NgModule, inject } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import {
  IHappeningContext,
  ISlotAdjustment,
  IHappeningSlotWithID,
} from '@sneat/mod-schedulus-core';
import { HappeningSlotModalComponent } from './happening-slot-modal.component';

export interface EditRecurringSlotParams {
  dateID: string;
  editMode: 'series' | 'single';
  adjustment?: ISlotAdjustment;
}

@Injectable()
export class HappeningSlotModalService {
  private readonly modalController = inject(ModalController);

  async editSingleHappeningSlot(
    event: Event,
    happening: IHappeningContext,
    recurring?: EditRecurringSlotParams,
    slot?: IHappeningSlotWithID,
  ): Promise<void> {
    // console.log('editSingleHappeningSlot()', happening, recurring, slot);
    event.stopPropagation();
    event.preventDefault();
    const space = happening.space;
    if (!space) {
      return Promise.reject('no space context');
    }
    const modal = await this.modalController.create({
      component: HappeningSlotModalComponent,
      componentProps: {
        space,
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
