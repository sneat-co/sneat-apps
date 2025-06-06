import { Component, inject } from '@angular/core';
import {
	IonBackButton,
	IonButton,
	IonButtons,
	IonContent,
	IonHeader,
	IonIcon,
	IonMenuButton,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { ISaveEvent } from '@sneat/components';
import { ContactDetailsComponent, PersonTitle } from '@sneat/contactus-shared';
import { SneatNavService } from '@sneat/core';
import { IAddress } from '@sneat/contactus-core';
import {
	ContactService,
	ContactusServicesModule,
	IContactRequest,
	IUpdateContactRequest,
} from '@sneat/contactus-services';
import { SpaceServiceModule } from '@sneat/space-services';
import { ContactBasePage } from '../contact-base-page';

@Component({
	selector: 'sneat-contact-page',
	templateUrl: './contact-page.component.html',
	imports: [
		ContactDetailsComponent,
		ContactusServicesModule,
		SpaceServiceModule,
		PersonTitle,
		IonHeader,
		IonToolbar,
		IonButtons,
		IonBackButton,
		IonTitle,
		IonButton,
		IonIcon,
		IonMenuButton,
		IonContent,
	],
})
export class ContactPageComponent extends ContactBasePage {
	private readonly contactsService = inject(ContactService);
	private readonly sneatNavService = inject(SneatNavService);

	protected segment: 'contact' | 'members' | 'assets' = 'contact';

	constructor() {
		const contactService = inject(ContactService);

		super('ContactPageComponent', contactService);
		this.defaultBackPage = 'contacts';
	}

	// TODO: use or remove
	private watchChildContacts(): void {
		const contactID = this.$contactID();
		if (!contactID) {
			return;
		}
		const space = this.space;
		if (!space) {
			return;
		}
		this.contactsService
			.watchChildContacts(space, contactID)
			.pipe(this.takeUntilDestroyed())
			.subscribe({
				next: (children) => {
					console.log('children', children);
				},
				error: this.errorLogger.logErrorHandler('failed to get child contacts'),
			});
	}

	// TODO: use or remove
	protected saveAddress(save: ISaveEvent<IAddress>): void {
		console.log('ContactPageComponent.saveAddress()', save);

		const spaceID = this.space?.id,
			contactID = this.$contactID(),
			address = save.object;

		if (!spaceID || !contactID || !address) {
			save.error('Can not save address without team and contact context');
			return;
		}

		const request: IUpdateContactRequest = {
			spaceID,
			contactID,
			address,
		};

		this.contactService.updateContact(request).subscribe({
			next: () => save.success(),
			error: save.error,
		});
	}

	protected deleteContact(): void {
		const contact = this.$contact();
		if (!contact) {
			return;
		}
		if (
			!confirm(
				`Are you sure you want to delete contact "${contact.brief?.title}"?`,
			)
		) {
			return;
		}
		const request: IContactRequest = {
			spaceID: this.space.id,
			contactID: contact.id,
		};

		this.contactsService.deleteContact(request).subscribe({
			next: () => {
				this.sneatNavService.goBack(`/space/${this.space?.id}/contacts`);
			},
			error: this.errorLogger.logErrorHandler('failed to delete contact'),
		});
	}
}
