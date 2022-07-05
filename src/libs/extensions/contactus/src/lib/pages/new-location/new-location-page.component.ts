import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IContactDto } from '@sneat/dto';
import { ICreateContactRequest } from '@sneat/team/models';
import { ContactComponentBaseParams } from '../../contact-component-base-params';
import { ContactBasePage } from '../contact-base-page';

@Component({
	selector: 'sneat-new-location-page',
	templateUrl: './new-location-page.component.html',
})
export class NewLocationPageComponent extends ContactBasePage {

	contactDto: IContactDto = { type: 'location' };

	isCreating = false;

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

	submit(): void {
		const { title, countryID, address } = this.contactDto;
		if (!title || !countryID || !address) {
			alert('Please populate all required fields');
			return;
		}
		const request: ICreateContactRequest = {
			teamID: this.team.id,
			type: 'location',
			parentContactID: this.contact?.id,
			location: {
				title,
				address,
			},
		};
		this.isCreating = true;
		this.contactService.createContact(this.team, request)
			.subscribe({
				next: newContact => {
					console.log('new location created with ID=' + newContact.id);
					// this.navController.pop()
					// 	.then(() => console.log('popped navigation'))
					// 	.catch(() => {
					// 		this.navController
					// 			.navigateBack(`/space/${this.team.type}/${this.team.id}/contact/${this.contact?.id}`)
					// 			.catch(this.errorLogger.logErrorHandler('failed navigate to parent contact'));
					// 	});
					this.navController
						.navigateBack(`/space/${this.team.type}/${this.team.id}/contact/${this.contact?.id}`)
						.catch(this.errorLogger.logErrorHandler('failed navigate to parent contact'));
				},
				error: err => {
					this.errorLogger.logError(err, 'Failed to create new contact');
					this.isCreating = false;
				},
			});
	}
}
