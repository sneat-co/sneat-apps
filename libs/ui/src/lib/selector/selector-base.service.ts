import { inject } from '@angular/core';
import { ModalController, ModalOptions } from '@ionic/angular/standalone';
import type { ComponentProps, ComponentRef } from '@ionic/core';
import { ErrorLogger } from '@sneat/core';
import { ISelectItem } from './selector-interfaces';
import { ISelectorOptions } from './selector-options';

export abstract class SelectorBaseService<T = ISelectItem> {
  protected readonly errorLogger = inject(ErrorLogger);
  private readonly modalController = inject(ModalController);

  protected constructor(private readonly component: ComponentRef) {}

  public async selectSingleInModal(
    options: ISelectorOptions<T>,
  ): Promise<T | null> {
    const result = await this.selectMultipleInModal(options);
    return result ? result[0] : null;
  }

  // We make it protected so each service must override it for easiness of navigation
  protected async selectMultipleInModal(
    options: ISelectorOptions<T>,
  ): Promise<T[] | undefined> {

    let result: readonly T[] | undefined = undefined;

    const onSelected = options.onSelected;

    options = {
      ...options,
      onSelected: async (items?: T[]): Promise<void> => {
        if (onSelected) {
          await onSelected(items);
        }
        await this.modalController.dismiss(items);
        result = items;
      },
    };
    let componentProps: ComponentProps<unknown> = {
      ...options.componentProps,
      selectMode: 'multiple',
      onSelected: options.onSelected,
      mode: 'modal',
    };
    if (options.title) {
      componentProps = { ...componentProps, title: options.title };
    }
    const modalOptions: ModalOptions = {
      component: this.component,
      componentProps: componentProps,
      keyboardClose: true,
    };
    const modal = await this.modalController.create(modalOptions);
    await modal.present();

    // 🔹 Track when the modal is dismissed
    await modal.onDidDismiss();

    return result;
  }
}
