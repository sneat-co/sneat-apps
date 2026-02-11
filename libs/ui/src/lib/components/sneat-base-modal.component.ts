import { inject, Injectable } from '@angular/core';
import { SneatBaseComponent } from './sneat-base.component';
import { ModalController } from '@ionic/angular/standalone';

@Injectable()
export abstract class SneatBaseModalComponent extends SneatBaseComponent {
  private readonly modalController = inject(ModalController);

  protected close(): void {
    this.dismissModal();
  }

  protected dismissModal(data?: unknown, role?: string, id?: string): void {
    this.modalController
      .dismiss(data, role, id)
      .catch(
        this.errorLogger.logErrorHandler(
          `Failed to close modal ${this.className}`,
        ),
      );
  }
}
