import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ISelectItem } from '@sneat/components';
import { excludeEmpty } from '@sneat/core';
import { IContactDto } from '@sneat/dto';
import { ContactService } from '@sneat/extensions/contactus';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';
import { ICreateContactCompanyRequest } from '@sneat/team/models';
import { first, takeUntil } from 'rxjs';

@Component({
	selector: 'sneat-new-express-company-page',
	templateUrl: 'new-express-company-page.component.html',
})
export class NewExpressCompanyPageComponent extends TeamBaseComponent implements OnDestroy {

	readonly contactTypes: ISelectItem[] = [
		{ id: 'agent', title: 'Agent', iconName: 'body-outline' },
		{ id: 'buyer', title: 'Buyer', iconName: 'cash-outline' },
		{ id: 'carrier', title: 'Carrier', iconName: 'train-outline' },
		{ id: 'shipper', title: 'Shipper', iconName: 'boat-outline' },
	];

	contactType = '';
	isCreating = false;

	contactDto: IContactDto = { type: 'company' };

	constructor(
		route: ActivatedRoute,
		private readonly contactService: ContactService,
		teamParams: TeamComponentBaseParams,
	) {
		super('NewExpressCompanyPageComponent', route, teamParams);
		route.queryParamMap
			.pipe(
				first(),
				takeUntil(this.destroyed),
			)
			.subscribe({
				next: value => {
					this.contactType = value.get('role') || '';
				},
			});
	}

	onContactDtoChanged(contactDto: IContactDto): void {
		console.log('contactDto', contactDto);
		this.contactDto = contactDto;
	}

	create(): void {
		if (!this.contactDto.title) {
			alert('Contact title is a required field');
			return;
		}
		const request: ICreateContactCompanyRequest = excludeEmpty({
			company: excludeEmpty({
				countryID: this.contactDto.countryID || '--',
				title: this.contactDto.title?.trim() || '',
				address: this.contactDto.address?.trim() || undefined,
				roles: [this.contactType],
			}),
			roles: [this.contactType],
			teamID: this.team.id,
		});
		this.isCreating = true;
		this.contactService.createContact(request).subscribe({
			next: contact => {
				console.log('created contact:', contact);
				this.navController.pop().catch(() => {
					this.navController
						.navigateBack(['contacts'], { relativeTo: this.route })
						.catch(this.errorLogger.logErrorHandler('failed to navigate back to contacts page'));
				});
			},
			error: err => {
				this.errorLogger.logError(err, 'Failed to create contact');
				this.isCreating = false;
			},
		});
	}
}
