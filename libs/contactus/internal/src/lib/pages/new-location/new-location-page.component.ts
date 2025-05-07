import { Component } from '@angular/core';
import {
	IonBackButton,
	IonContent,
	IonHeader,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { PersonTitle } from '@sneat/components';
import { ContactService } from '@sneat/contactus-services';
import { LocationFormComponent } from '@sneat/contactus-shared';
import { IContactWithOptionalDbo } from '@sneat/contactus-core';
import { ContactBasePage } from '../contact-base-page';

@Component({
	selector: 'sneat-new-location-page',
	templateUrl: './new-location-page.component.html',
	imports: [
		LocationFormComponent,
		PersonTitle,
		IonHeader,
		IonToolbar,
		IonBackButton,
		IonTitle,
		IonContent,
	],
})
export class NewLocationPageComponent extends ContactBasePage {
	newLocation: IContactWithOptionalDbo = {
		id: '',
		brief: { type: 'location' },
		// space: this.space,
	};

	constructor(
		contactService: ContactService,
		// private readonly contactService: ContactService,
	) {
		super('ContactPageComponent', contactService);
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
		const url = this.spacePageUrl(`contact/${this.$contactID()}`);
		if (url) {
			this.navController
				.navigateBack(url)
				.catch(
					this.errorLogger.logErrorHandler('failed navigate to parent contact'),
				);
		}
	}
}
