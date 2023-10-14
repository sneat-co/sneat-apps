import { Inject, Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ISelectorOptions, SelectorBaseService } from '@sneat/components';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IContactContext } from '@sneat/team/models';
import {
	ContactSelectorComponent,
	IContactSelectorProps,
} from './contact-selector.component';

export interface IContactSelectorOptions
	extends ISelectorOptions<IContactContext> {
	readonly componentProps?: IContactSelectorProps;
}

export interface ISelectedContact {
	readonly contact: IContactContext;
	readonly role: string;
}

@Injectable()
export class ContactSelectorService extends SelectorBaseService<IContactContext> {
	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		modalController: ModalController,
	) {
		super(ContactSelectorComponent, errorLogger, modalController);
	}

	selectSingleContactInModal(
		options: IContactSelectorOptions,
	): Promise<IContactContext | null> {
		return this.selectSingleInModal(options);
	}

	selectMultipleContactsInModal(
		options: IContactSelectorOptions,
	): Promise<IContactContext[] | null> {
		return this.selectMultipleInModal(options);
	}
}
