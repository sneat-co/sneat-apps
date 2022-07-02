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

	constructor(
		route: ActivatedRoute,
		params: ContactComponentBaseParams,
		// private readonly contactService: ContactService,
	) {
		super('ContactPageComponent', route, params);
		this.defaultBackPage = 'contacts';
	}

	isCreating = false;

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
				countryID,
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
