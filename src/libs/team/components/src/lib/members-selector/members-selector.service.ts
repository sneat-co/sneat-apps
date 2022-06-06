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
		if (!options.team) {
			throw new Error('team context is required parameter to select members');
		}

		const result = new Promise<IMemberContext[]>(async (resolve, reject) => {
			const modalOptions: ModalOptions = {
				component: MembersSelectorModalComponent,
				componentProps: {
					...options,
				},
				keyboardClose: true,
			}
			const modal = await this.modalController.create(modalOptions);
			await modal.present();
		});

		return result;
	}
}
