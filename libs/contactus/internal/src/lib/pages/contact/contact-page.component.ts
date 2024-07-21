import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import {
	AddressFormComponent,
	ISaveEvent,
	SneatPipesModule,
} from '@sneat/components';
import {
	ContactComponentBaseParams,
	ContactComponentBaseParamsModule,
	ContactContactsComponent,
	ContactDetailsComponent,
	ContactRolesInputModule,
	ContactsListModule,
} from '@sneat/contactus-shared';
import { SneatNavService } from '@sneat/core';
import { IAddress } from '@sneat/contactus-core';
import {
	ContactService,
	ContactusServicesModule,
	IContactRequest,
	IUpdateContactRequest,
} from '@sneat/contactus-services';
import { ContactBasePage } from '../contact-base-page';

@Component({
	selector: 'sneat-contact-page',
	templateUrl: './contact-page.component.html',
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		RouterModule,
		IonicModule,
		SneatPipesModule,
		ContactsListModule,
		AddressFormComponent,
		ContactRolesInputModule,
		ContactContactsComponent,
		ContactDetailsComponent,
		ContactusServicesModule,
		ContactComponentBaseParamsModule,
	],
})
export class ContactPageComponent extends ContactBasePage {
	protected segment: 'contact' | 'members' | 'assets' = 'contact';

	constructor(
		route: ActivatedRoute,
		params: ContactComponentBaseParams,
		private readonly contactsService: ContactService,
		private readonly sneatNavService: SneatNavService,
	) {
		super('ContactPageComponent', route, params);
		this.defaultBackPage = 'contacts';
	}

	override onContactIdChanged(contactID: string): void {
		super.onContactIdChanged(contactID);
		this.watchChildContacts();
	}

	watchChildContacts(): void {
		if (!this.contact?.id) {
			return;
		}
		const space = this.space;
		if (!space) {
			return;
		}
		this.contactsService
			.watchChildContacts(space, this.contact?.id)
			.pipe(this.takeUntilNeeded())
			.subscribe({
				next: (children) => {
					console.log('children', children);
				},
				error: this.errorLogger.logErrorHandler('failed to get child contacts'),
			});
	}

	protected saveAddress(save: ISaveEvent<IAddress>): void {
		console.log('ContactPageComponent.saveAddress()', save);
		const spaceID = this.space?.id,
			contactID = this.contact?.id,
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

	protected readonly length = length;

	protected deleteContact(): void {
		const contact = this.contact;
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
