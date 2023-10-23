import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import {
	ContactComponentBaseParams,
	LocationFormModule,
} from '@sneat/contactus-shared';
import { IIdAndDto } from '@sneat/core';
import { IContactDto } from '@sneat/dto';
import { ContactBasePage } from '../contact-base-page';

@Component({
	selector: 'sneat-new-location-page',
	templateUrl: './new-location-page.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule, LocationFormModule, SneatPipesModule],
})
export class NewLocationPageComponent extends ContactBasePage {
	newLocation: IIdAndDto<IContactDto> = {
		id: '',
		dto: { type: 'location' },
	};

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

	onContactChanged(contact: IIdAndDto<IContactDto>): void {
		this.newLocation = contact;
	}

	onContactCreated(contact: IIdAndDto<IContactDto>): void {
		this.newLocation = contact;
		const team = this.team;
		if (!team) {
			throw new Error('Team is not defined');
		}
		const url = this.teamPageUrl(`contact/${this.contact?.id}`);
		if (url) {
			this.navController
				.navigateBack(url)
				.catch(
					this.errorLogger.logErrorHandler('failed navigate to parent contact'),
				);
		}
	}
}
