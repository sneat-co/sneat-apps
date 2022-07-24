import { Inject, Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ISelectorOptions, SelectorBaseService } from '@sneat/components';
import { ContactRole, ContactType } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IContactContext, ITeamContext } from '@sneat/team/models';
import { ContactSelectorComponent } from './contact-selector.component';

export interface IContactSelectorOptions extends ISelectorOptions<IContactContext> {
	readonly team: ITeamContext;
	readonly contactRole?: ContactRole;
	readonly contactType?: ContactType;
	readonly parentRole?: ContactRole;
	readonly subType?: ContactRole;
	readonly subRoleRequired?: boolean;
	readonly excludeContacts?: IContactContext[];
}

@Injectable()
export class ContactSelectorService extends SelectorBaseService<IContactContext> {
	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		modalController: ModalController,
	) {
		super(ContactSelectorComponent, errorLogger, modalController);
	}

	selectSingleContactInModal(options: IContactSelectorOptions): Promise<IContactContext | null> {
		return this.selectSingleInModal(options);
	}

	selectMultipleContactsInModal(options: IContactSelectorOptions): Promise<IContactContext[] | null> {
		return this.selectMultipleInModal(options);
	}
}
