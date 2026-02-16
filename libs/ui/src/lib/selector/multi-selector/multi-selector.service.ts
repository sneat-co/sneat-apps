import { Inject } from '@angular/core';
import { ModalController, ModalOptions } from '@ionic/angular/standalone';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { ISelectItem } from '../selector-interfaces';
import { MultiSelectorComponent } from './multi-selector.component';

export class MultiSelectorService {
  constructor(
    @Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
    private readonly modalController: ModalController,
  ) {}

  selectMultiple(
    items: ISelectItem[],
    selectedItems: ISelectItem[],
  ): Promise<ISelectItem[]> {
    const result = new Promise<ISelectItem[]>((resolve, reject) => {
      const modalOptions: ModalOptions = {
        component: MultiSelectorComponent,
        componentProps: {
          items,
          selectedItems,
        },
        keyboardClose: true,
      };
      this.modalController
        .create(modalOptions)
        .then((modal) => {
          modal
            .onDidDismiss()
            .then((res) => resolve(res.data?.selectedItems || []))
            .catch((err) => {
              this.errorLogger.logError(err, 'Failed to handle modal dismiss');
              reject(err);
            });
          modal.present().catch((err) => {
            reject(err);
            this.errorLogger.logError('Failed to present modal');
          });
        })
        .catch((err) => {
          this.errorLogger.logError(err, 'Failed to create modal');
          reject(err);
        });
    });

    return result;
  }
}
