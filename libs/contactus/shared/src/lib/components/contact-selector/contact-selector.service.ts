import { Inject, Injectable, InjectionToken } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ISelectorOptions, SelectorBaseService } from '@sneat/components';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IContactContext } from '@sneat/contactus-core';
import { IContactSelectorProps } from './contact-selector.interfaces';

export interface IContactSelectorOptions
	extends ISelectorOptions<IContactContext> {
	readonly componentProps?: IContactSelectorProps;
}

export interface ISelectedContact {
	readonly contact: IContactContext;
	readonly role: string;
}

export const ContactSelector = new InjectionToken('ContactSelector');

@Injectable()
export class ContactSelectorService extends SelectorBaseService<IContactContext> {
	constructor(
		@Inject(ContactSelector) // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
		component: Function | HTMLElement | string | null,
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		modalController: ModalController,
	) {
		super(component, errorLogger, modalController);
	}

	public readonly selectSingleContactInModal = this.selectSingleInModal;

	public readonly selectMultipleContactsInModal = this.selectMultipleInModal;
}
