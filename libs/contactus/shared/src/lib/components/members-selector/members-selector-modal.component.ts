import { Component, Inject, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IContactContext } from '@sneat/team-models';
import { Observable } from 'rxjs';
import { ISelectMembersOptions } from './members-selector.options';

@Component({
	selector: 'sneat-members-selector-modal',
	templateUrl: 'members-selector-modal.component.html',
})
export class MembersSelectorModalComponent implements ISelectMembersOptions {
	@Input() mode: 'modal' | 'in-page' = 'in-page';
	@Input() members?: IContactContext[];
	@Input() selectedMembers?: IContactContext[];
	@Input() max?: number;
	@Input() onAdded?: (member: IContactContext) => Observable<void>;
	@Input() onRemoved?: (member: IContactContext) => Observable<void>;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly modalController: ModalController,
	) {
		console.log('MembersSelectorModalComponent.constructor()');
	}

	close(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		this.modalController
			.dismiss()
			.catch(
				this.errorLogger.logErrorHandler(
					'Failed to dismiss members selector modal',
				),
			);
	}
}
