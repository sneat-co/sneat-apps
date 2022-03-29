//tslint:disable:no-unsafe-any
import {Component, OnInit} from '@angular/core';
import {eq, IContactService} from '../../../../services/interfaces';
import {CommuneBasePageParams} from '../../../../services/params';
// import {CommuneBasePage} from '../../../../pages/commune-base-page';
import { IContactDto } from '@sneat/dto';
import { BaseTeamPageDirective } from '@sneat/team/components';

@Component({
	selector: 'sneat-contact-page',
	templateUrl: './contact-page.component.html',
	providers: [CommuneBasePageParams],
})
export class ContactPageComponent extends BaseTeamPageDirective implements OnInit {

	public segment: 'contact' | 'members' | 'assets' = 'contact';
	public contact?: IContactDto;

	constructor(
		params: CommuneBasePageParams,
		private readonly contactsService: IContactService,
	) {
		super('contacts', params);
	}

	ngOnInit(): void {
		super.ngOnInit();
		this.route.queryParamMap.subscribe(params => {
			const contactId = params.get('id') || undefined;
			{
				const contact = window.history.state.contact as IContactDto;
				if (contact && eq(contact.id, contactId)) {
					this.contact = contact;
					if (!eq(this.communeRealId, contact.communeId)) {
						this.setPageCommuneIds('ContactPage.contactFromHistoryState', {real: contact.communeId});
					}
				}
			}
			if (contactId) {
				this.subscriptions.push(this.contactsService.watchById(contactId)
					.subscribe(
						contact => {
							if (!contact) {
								return;
							}
							this.contact = contact;
							if (!eq(this.communeRealId, contact.communeId)) {
								this.setPageCommuneIds('ContactPage.contactFromObservable', {real: contact.communeId});
							}
						},
						this.errorLogger.logError,
					));
			}
		});

	}

	goMember(id: string): void {
		this.navigateForward('member', {id});
	}
}
