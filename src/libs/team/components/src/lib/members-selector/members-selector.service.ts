import { Inject, Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalOptions } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IMemberContext } from '@sneat/team/models';
import { ISelectMembersOptions } from './member-selector.options';
import { MembersSelectorModalComponent } from './members-selector-modal.component';

@Injectable()
export class MembersSelectorService {

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly modalController: ModalController,
	) {
	}


	selectMembersInModal(options: ISelectMembersOptions): Promise<IMemberContext[]> {
		console.log('selectMembers(), options:', options);
		if (!options.members) {
			throw new Error('members is required parameter to select members');
		}

		const result = new Promise<IMemberContext[]>((resolve, reject) => {
			const modalOptions: ModalOptions = {
				component: MembersSelectorModalComponent,
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
