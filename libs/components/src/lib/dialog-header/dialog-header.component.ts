import { Component, Input, inject } from '@angular/core';
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
  private readonly modalController = inject(ModalController);

  @Input() dialogTitle = 'Dialog';

  close(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.modalController.dismiss().catch(console.error);
  }
}
