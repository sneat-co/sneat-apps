import { inject } from '@angular/core';
import { ModalController, ModalOptions } from '@ionic/angular';
import type { ComponentRef } from '@ionic/core';
import { ErrorLogger } from '@sneat/logging';
import { ISelectItem } from './selector-interfaces';
import { ISelectorOptions } from './selector-options';

export class SelectorBaseService<T = ISelectItem> {
	protected readonly errorLogger = inject(ErrorLogger);
	private readonly modalController = inject(ModalController);

	constructor(
		// _eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
		// private readonly component: Function | HTMLElement | string | null,
		private readonly component: ComponentRef,
	) {}

	public selectSingleInModal(options: ISelectorOptions<T>): Promise<T | null> {
		console.log('selectSingleInModal(), options:', options);
		return new Promise<T | null>((resolve, reject) => {
			this.selectMultipleInModal(options)
				.then((items) => resolve(items?.length ? items[0] : null))
				.catch(reject);
		});
	}

	public selectMultipleInModal(
		options: ISelectorOptions<T>,
	): Promise<T[] | null> {
		console.log('selectInModal(), options:', options);
		// if (!options.items) {
		// 	return Promise.reject(new Error('items is required parameter'))
		// }

		const result = new Promise<T[] | null>((resolve, reject) => {
			if (!options.onSelected) {
				options = {
					...options,
					onSelected: (items: T[] | null): void => {
						this.modalController.dismiss(items).catch((err) => {
							this.errorLogger.logError(err, 'Failed to dismiss modal');
							reject(err);
						});
						resolve(items);
					},
				};
			}
			const modalOptions: ModalOptions = {
				component: this.component,
				componentProps: {
					// ...options,
					...options.componentProps,
					selectMode: 'multiple',
					onSelected: options.onSelected,
					mode: 'modal',
				},
				keyboardClose: true,
			};
			this.modalController
				.create(modalOptions)
				.then((modal) =>
					modal
						.present()
						.catch(this.errorLogger.logErrorHandler('Failed to present modal')),
				)
				.catch(this.errorLogger.logErrorHandler('Failed to create modal'));
		});

		return result;
	}
}
