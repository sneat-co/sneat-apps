import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IContactDto } from '@sneat/dto';
import { IContactContext, ICreateContactRequest } from '@sneat/team/models';
import { ContactComponentBaseParams } from '../../contact-component-base-params';
import { ContactBasePage } from '../contact-base-page';

@Component({
	selector: 'sneat-new-location-page',
	templateUrl: './new-location-page.component.html',
})
export class NewLocationPageComponent extends ContactBasePage {

	contactDto: IContactDto = { type: 'location' };


	constructor(
		route: ActivatedRoute,
		params: ContactComponentBaseParams,
		// private readonly contactService: ContactService,
	) {
		super('ContactPageComponent', route, params);
		this.defaultBackPage = 'contacts';
	}

	protected override onTeamDtoChanged() {
		super.onTeamDtoChanged();
		if (this.team?.dto?.countryID && !this.contactDto.countryID) {
			this.contactDto = { ...this.contactDto, countryID: this.team.dto.countryID };
		}
	}

	onContactCreated(contact: IContactContext): void {
		if (contact.dto) {
			this.contactDto = contact.dto;
		}
		this.navController
			.navigateBack(`/space/${this.team.type}/${this.team.id}/contact/${contact?.id}`)
			.catch(this.errorLogger.logErrorHandler('failed navigate to parent contact'));
	}
}
