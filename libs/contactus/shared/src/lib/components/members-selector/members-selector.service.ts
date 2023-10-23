import { Inject, Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalOptions } from '@ionic/angular';
import { IIdAndBrief } from '@sneat/core';
import { IContactBrief } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
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
	): Promise<IIdAndBrief<IContactBrief>[]> {
		console.log('selectMembers(), options:', options);
		if (!options.members) {
			throw new Error('members is required parameter to select members');
		}

		// TODO: This smells, most likely can be simplified
		const result = new Promise<IIdAndBrief<IContactBrief>[]>(
			(resolve, reject) => {
				const modalOptions: ModalOptions = {
					component: MembersSelectorModalComponent,
					componentProps: {
						...options,
						mode: 'modal',
						onAdded: (member: IIdAndBrief<IContactBrief>) => {
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
			},
		);

		return result;
	}
}
