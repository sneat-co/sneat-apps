import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
} from '@angular/core';
import {
  IonBadge,
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonLabel,
} from '@ionic/angular/standalone';
import {
  emptyHappeningSlot,
  IHappeningContext,
  IHappeningSlotWithID,
  WdToWeekdayPipe,
} from '@sneat/mod-schedulus-core';
import { HappeningSlotModalService } from '../happening-slot-form/happening-slot-modal.service';

@Component({
  selector: 'sneat-happening-slot',
  templateUrl: 'happening-slot.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    // TODO(help-wanted): Can we import just specific pipe?
    WdToWeekdayPipe,
    IonItem,
    IonBadge,
    IonLabel,
    IonButtons,
    IonButton,
    IonIcon,
  ],
})
export class HappeningSlotComponent {
  private readonly happeningSlotModalService = inject(
    HappeningSlotModalService,
  );

  @Input({ required: true }) public happening?: IHappeningContext;
  @Input({ required: true }) public slot: IHappeningSlotWithID =
    emptyHappeningSlot;

  protected deleting = false;

  protected async editHappeningSlot(event: Event): Promise<void> {
    if (!this.happening) {
      return Promise.reject('no happening');
    }
    if (!this.happening) {
      return Promise.reject('no happening');
    }
    await this.happeningSlotModalService.editSingleHappeningSlot(
      event,
      this.happening,
      undefined,
      this.slot,
    );
  }
}
