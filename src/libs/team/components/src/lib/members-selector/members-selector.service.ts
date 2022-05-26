import { Inject, Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ModalOptions } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISelectMembersOptions } from './member-selector.options';
import { MembersSelectorComponent } from './members-selector.component';


@Injectable()
export class MembersSelectorService {

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly modalController: ModalController,
	) {
	}


	async selectMembers(options: ISelectMembersOptions): Promise<void> {
		console.log('selectMembers(), options:', options);
		if (!options.teamIDs.length) {
			throw new Error('at least 1 team should be specified');
		}

		const modalOptions: ModalOptions = {
			component: MembersSelectorComponent,
			componentProps: {
				foo: 'bar',
				options: options,
			},
			keyboardClose: true,
		}
		const modal = await this.modalController.create(modalOptions);
		await modal.present();
	}
}
