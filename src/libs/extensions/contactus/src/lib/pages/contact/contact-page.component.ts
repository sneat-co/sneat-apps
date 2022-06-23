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
		this.route.queryParamMap.subscribe(params => {
			const contactId = params.get('id') || undefined;
			{
				const contact = window.history.state.contact as IContactContext;
				if (contact && eq(contact.id, contactId)) {
					this.contact = contact;
					// if (!eq(this.communeRealId, contact.communeId)) {
					// 	this.setPageCommuneIds('ContactPage.contactFromHistoryState', { real: contact.communeId });
					// }
				}
			}
			if (contactId) {
				this.contactsService
					.watchById(contactId)
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
							},
							error: this.errorLogger.logErrorHandler('failed to get contact by ID'),
						},
					);
			}
		});

	}

	goMember(id: string): void {
		this.teamParams.teamNavService.navigateToMember(this.navController, {id});
	}
}
