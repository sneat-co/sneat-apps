import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
	ContactContactsComponent,
	ContactDetailsComponent,
	ContactRolesInputModule,
	ContactsListModule,
} from '@sneat/contactus-shared';
import { eq, SneatNavService } from '@sneat/core';
import { IAddress } from '@sneat/dto';
import {
	ContactService,
	IContactRequest,
	IUpdateContactRequest,
} from '@sneat/contactus-services';
import { IContactContext } from '@sneat/team-models';
import { ContactBasePage } from '../contact-base-page';

@Component({
	selector: 'sneat-contact-page',
	templateUrl: './contact-page.component.html',
	providers: [ContactComponentBaseParams],
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
	],
})
export class ContactPageComponent extends ContactBasePage implements OnInit {
	public segment: 'contact' | 'members' | 'assets' = 'contact';

	constructor(
		route: ActivatedRoute,
		params: ContactComponentBaseParams,
		private readonly contactsService: ContactService,
		private readonly sneatNavService: SneatNavService,
	) {
		super('ContactPageComponent', route, params);
		this.defaultBackPage = 'contacts';
	}

	ngOnInit(): void {
		// super.ngOnInit();
		this.route.paramMap.subscribe((params) => {
			const contactId = params.get('contactID') || undefined;
			{
				const contact = window.history.state.contact as IContactContext;
				if (contact && eq(contact.id, contactId)) {
					this.contact = contact;
					// if (!eq(this.communeRealId, contact.communeId)) {
					// 	this.setPageCommuneIds('ContactPage.contactFromHistoryState', { real: contact.communeId });
					// }
				} else if (contactId) {
					const team = this.team;
					if (!team) {
						return;
					}
					this.contact = { id: contactId, team };
				}
			}
			this.onContactChanged();
		});
	}

	private watchContact(): void {
		if (!this.contact?.id) {
			return;
		}
		const team = this.team;
		if (!team) {
			return;
		}
		this.contactsService
			.watchContactById(team, this.contact?.id)
			.pipe(this.takeUntilNeeded())
			.subscribe({
				next: (contact) => {
					if (!contact) {
						return;
					}
					this.contact = contact;
				},
				error: this.errorLogger.logErrorHandler('failed to get contact by ID'),
			});
	}

	onContactChanged(): void {
		this.watchContact();
		this.watchChildContacts();
	}

	watchChildContacts(): void {
		if (!this.contact?.id) {
			return;
		}
		const team = this.team;
		if (!team) {
			return;
		}
		this.contactsService
			.watchChildContacts(team, this.contact?.id)
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
		const teamID = this.team?.id,
			contactID = this.contact?.id,
			address = save.object;

		if (!teamID || !contactID || !address) {
			save.error('Can not save address without team and contact context');
			return;
		}

		const request: IUpdateContactRequest = { teamID, contactID, address };
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
			teamID: this.team.id,
			contactID: contact.id,
		};

		this.contactsService.deleteContact(request).subscribe({
			next: () => {
				this.sneatNavService.goBack(`/space/${this.team?.id}/contacts`);
			},
			error: this.errorLogger.logErrorHandler('failed to delete contact'),
		});
	}
}
