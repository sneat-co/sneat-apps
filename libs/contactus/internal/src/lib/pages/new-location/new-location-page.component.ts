import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PersonTitle } from '@sneat/components';
import {
	ContactComponentBaseParams,
	LocationFormComponent,
} from '@sneat/contactus-shared';
import { IContactWithOptionalDbo } from '@sneat/contactus-core';
import { ContactBasePage } from '../contact-base-page';

@Component({
	selector: 'sneat-new-location-page',
	templateUrl: './new-location-page.component.html',
	imports: [CommonModule, IonicModule, LocationFormComponent, PersonTitle],
})
export class NewLocationPageComponent extends ContactBasePage {
	newLocation: IContactWithOptionalDbo = {
		id: '',
		brief: { type: 'location' },
		// space: this.space,
	};

	constructor(
		params: ContactComponentBaseParams,
		// private readonly contactService: ContactService,
	) {
		super('ContactPageComponent', params);
		this.defaultBackPage = 'contacts';
	}

	protected override onSpaceDboChanged() {
		super.onSpaceDboChanged();
		// if (this.team?.dto?.countryID && !this.newLocationDto.countryID) {
		// 	this.newLocationDto = { ...this.newLocationDto, countryID: this.team.dto.countryID };
		// }
	}

	onLocationChanged(contact: IContactWithOptionalDbo): void {
		this.newLocation = contact;
	}

	onContactCreated(contact: IContactWithOptionalDbo): void {
		this.newLocation = contact;
		const space = this.space;
		if (!space) {
			throw new Error('Space is not defined');
		}
		const url = this.spacePageUrl(`contact/${this.contact?.id}`);
		if (url) {
			this.navController
				.navigateBack(url)
				.catch(
					this.errorLogger.logErrorHandler('failed navigate to parent contact'),
				);
		}
	}
}
