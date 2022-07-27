import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IContactContext } from '@sneat/team/models';
import { ContactComponentBaseParams } from '../../contact-component-base-params';
import { ContactBasePage } from '../contact-base-page';

@Component({
	selector: 'sneat-new-location-page',
	templateUrl: './new-location-page.component.html',
})
export class NewLocationPageComponent extends ContactBasePage {

	newLocation: IContactContext = {id: '', dto: {type: 'location'}, team: {id: ''}};

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
		// if (this.team?.dto?.countryID && !this.newLocationDto.countryID) {
		// 	this.newLocationDto = { ...this.newLocationDto, countryID: this.team.dto.countryID };
		// }
	}

	onContactChanged(contact: IContactContext): void {
		this.newLocation = contact;
	}

	onContactCreated(contact: IContactContext): void {
		this.newLocation = contact;
		this.navController
			.navigateBack(`/space/${this.team.type}/${this.team.id}/contact/${this.contact?.id}`)
			.catch(this.errorLogger.logErrorHandler('failed navigate to parent contact'));
	}
}
