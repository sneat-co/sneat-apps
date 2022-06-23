import { ModalController, ModalOptions } from '@ionic/angular';
import { IErrorLogger } from '@sneat/logging';
import { ISelectorOptions } from './selector-options';

export class SelectorBaseService<T> {
	constructor(
		private readonly component: any,
		private readonly errorLogger: IErrorLogger,
		private readonly modalController: ModalController,
	) {
	}

	selectSingleInModal(options: ISelectorOptions<T>): Promise<T> {
		console.log('selectSingleInModal(), options:', options);
		return new Promise<T>((resolve, reject) => {
			this.selectInModal(options)
				.then(items => resolve(items[0]))
				.catch(reject);
		});
	}

	selectInModal(options: ISelectorOptions<T>): Promise<T[]> {
		console.log('selectInModal(), options:', options);
		// if (!options.items) {
		// 	return Promise.reject(new Error('items is required parameter'))
		// }

		const result = new Promise<T[]>((resolve, reject) => {
			const modalOptions: ModalOptions = {
				component: this.component,
				componentProps: {
					...options,
					mode: 'modal',
				},
				keyboardClose: true,
			}
			this.modalController.create(modalOptions)
				.then(
					modal => modal.present().catch(this.errorLogger.logErrorHandler('Failed to present modal'))
				).catch(this.errorLogger.logErrorHandler('Failed to create modal'));
		});

		return result;
	}
}
