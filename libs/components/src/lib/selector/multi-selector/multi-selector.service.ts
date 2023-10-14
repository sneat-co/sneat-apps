import { Inject } from '@angular/core';
import { ModalController, ModalOptions } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISelectItem } from '../../..';
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
		console.log('MultiSelectorService.selectMultiple()', items, selectedItems);
		const result = new Promise<ISelectItem[]>((resolve, reject) => {
			const modalOptions: ModalOptions = {
				component: MultiSelectorComponent,
				componentProps: {
					items,
				},
				keyboardClose: true,
			};
			this.modalController
				.create(modalOptions)
				.then((modal) =>
					modal.present().catch((err) => {
						reject(err);
						this.errorLogger.logError('Failed to present modal');
					}),
				)
				.catch((err) => {
					this.errorLogger.logError(err, 'Failed to create modal');
					reject(err);
				});
		});

		return result;
	}
}
