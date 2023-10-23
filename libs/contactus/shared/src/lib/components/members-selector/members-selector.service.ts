import { Inject, Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalOptions } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IContactContext } from '@sneat/team-models';
import { ISelectMembersOptions } from './members-selector.options';
import { MembersSelectorModalComponent } from './members-selector-modal.component';

@Injectable()
export class MembersSelectorService {
	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly modalController: ModalController,
	) {}

	selectMembersInModal(
		options: ISelectMembersOptions,
	): Promise<IContactContext[]> {
		console.log('selectMembers(), options:', options);
		if (!options.members) {
			throw new Error('members is required parameter to select members');
		}

		// TODO: This smells, most likely can be simplified
		const result = new Promise<IContactContext[]>((resolve, reject) => {
			const modalOptions: ModalOptions = {
				component: MembersSelectorModalComponent,
				componentProps: {
					...options,
					mode: 'modal',
					onAdded: (member: IContactContext) => {
						resolve([member]);
					},
				},
				keyboardClose: true,
			};
			this.modalController
				.create(modalOptions)
				.then((modal) => {
					modal.present().catch((err: unknown) => {
						this.errorLogger.logError(err, 'Failed to present modal');
						reject(err);
					});
				})
				.catch((err: unknown) => {
					this.errorLogger.logError(err, 'Failed to create modal');
					reject(err);
				});
		});

		return result;
	}
}
