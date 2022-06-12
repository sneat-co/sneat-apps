import { Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IMemberBrief } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IMemberContext, ITeamContext } from '@sneat/team/models';
import { memberContextFromBrief } from '@sneat/team/services';
import { Observable, Subject } from 'rxjs';
import { ISelectMembersOptions } from './members-selector.options';


@Component({
	selector: 'sneat-members-selector-modal',
	templateUrl: 'members-selector-modal.component.html',
})
export class MembersSelectorModalComponent implements ISelectMembersOptions {

	@Input() mode: 'modal' | 'in-page' = 'in-page';
	@Input() members?: IMemberContext[];
	@Input() selectedMembers?: IMemberContext[];
	@Input() max?: number;
	@Input() onAdded?: (member: IMemberContext) => Observable<void>;
	@Input() onRemoved?: (member: IMemberContext) => Observable<void>;


	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly modalController: ModalController,
	) {
		console.log('MembersSelectorModalComponent.constructor()');
	}

	close(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		this.modalController.dismiss()
			.catch(this.errorLogger.logErrorHandler('Failed to dismiss members selector modal'));
	}
}
