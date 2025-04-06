import { inject } from '@angular/core';
import { ModalController, ModalOptions } from '@ionic/angular';
import type { ComponentProps, ComponentRef } from '@ionic/core';
import { ErrorLogger } from '@sneat/logging';
import { ISelectItem } from './selector-interfaces';
import { ISelectorOptions } from './selector-options';

export abstract class SelectorBaseService<T = ISelectItem> {
	protected readonly errorLogger = inject(ErrorLogger);
	private readonly modalController = inject(ModalController);

	protected constructor(private readonly component: ComponentRef) {}

	public async selectSingleInModal(
		options: ISelectorOptions<T>,
	): Promise<T | null> {
		console.log('selectSingleInModal(), options:', options);
		const result = await this.selectMultipleInModal(options);
		return result ? result[0] : null;
	}

	// We make it protected so each service must override it for easiness of navigation
	protected async selectMultipleInModal(
		options: ISelectorOptions<T>,
	): Promise<T[] | null> {
		console.log('selectMultipleInModal(), options:', options);

		let result: readonly T[] | null = null;
		let error: unknown;

		if (!options.onSelected) {
			options = {
				...options,
				onSelected: (items: T[] | null): Promise<void> => {
					return new Promise((resolve2, reject2) => {
						this.modalController.dismiss(items).catch((err) => {
							this.errorLogger.logError(err, 'Failed to dismiss modal');
							reject2(err);
							error = err;
						});
						resolve2();
						result = items;
					});
				},
			};
		}
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
		const { role, data } = await modal.onDidDismiss();
		console.log('Modal closed with role:', role, 'data:', data);

		if (error) {
			throw error;
		}
		return result;
	}
}
