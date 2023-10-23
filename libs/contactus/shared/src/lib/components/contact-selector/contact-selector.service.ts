import { Inject, Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ISelectorOptions, SelectorBaseService } from '@sneat/components';
import { IIdAndBrief } from '@sneat/core';
import { IContactBrief } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	ContactSelectorComponent,
	IContactSelectorProps,
} from './contact-selector.component';

export interface IContactSelectorOptions
	extends ISelectorOptions<IIdAndBrief<IContactBrief>> {
	readonly componentProps?: IContactSelectorProps;
}

export interface ISelectedContact {
	readonly contact: IIdAndBrief<IContactBrief>;
	readonly role: string;
}

@Injectable()
export class ContactSelectorService extends SelectorBaseService<
	IIdAndBrief<IContactBrief>
> {
	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		modalController: ModalController,
	) {
		super(ContactSelectorComponent, errorLogger, modalController);
	}

	selectSingleContactInModal(
		options: IContactSelectorOptions,
	): Promise<IIdAndBrief<IContactBrief> | null> {
		return this.selectSingleInModal(options);
	}

	selectMultipleContactsInModal(
		options: IContactSelectorOptions,
	): Promise<IIdAndBrief<IContactBrief>[] | null> {
		return this.selectMultipleInModal(options);
	}
}
