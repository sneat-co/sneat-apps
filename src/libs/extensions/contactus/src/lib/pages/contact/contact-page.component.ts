import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { eq } from '@sneat/core';
import { IContactContext } from '@sneat/team/models';
import { ContactComponentBaseParams } from '../../contact-component-base-params';
import { ContactService } from '../../services';
import { ContactBasePage } from '../contact-base-page';

@Component({
	selector: 'sneat-contact-page',
	templateUrl: './contact-page.component.html',
	providers: [ContactComponentBaseParams],
})
export class ContactPageComponent extends ContactBasePage implements OnInit {

	public segment: 'contact' | 'members' | 'assets' = 'contact';

	constructor(
		route: ActivatedRoute,
		params: ContactComponentBaseParams,
		private readonly contactsService: ContactService,
	) {
		super('ContactPageComponent', route, params);
		this.defaultBackPage = 'contacts';
	}

	ngOnInit(): void {
		// super.ngOnInit();
		this.route.paramMap.subscribe(params => {
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
			.pipe(
				this.takeUntilNeeded(),
			)
			.subscribe(
				{
					next: contact => {
						if (!contact) {
							return;
						}
						this.contact = contact;
						this.contactLocations = contact?.dto?.relatedContacts
							?.map(brief => ({
								id: brief.id,
								team: contact.team,
								brief,
							}));
						console.log('contact', contact, 'contactLocations', this.contactLocations);
					},
					error: this.errorLogger.logErrorHandler('failed to get contact by ID'),
				},
			);
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
			.pipe(
				this.takeUntilNeeded(),
			)
			.subscribe({
				next: children => {
					console.log('children', children);
				},
				error: this.errorLogger.logErrorHandler('failed to get child contacts'),
			});
	}

	goMember(id: string): void {
		const team = this.team;
		if (!team) {
			throw new Error('Can not navigate to member without team context');
		}
		this.teamParams.teamNavService.navigateToMember(this.navController, { id, team });
	}
}
