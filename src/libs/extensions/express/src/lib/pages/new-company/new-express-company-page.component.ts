import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ISelectItem } from '@sneat/components';
import { excludeEmpty } from '@sneat/core';
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
	countryID = '';
	title = '';
	address = '';
	isCreating = false;

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

	create(): void {
		if (!this.title) {
			alert('title is required field');
		}
		const request: ICreateContactCompanyRequest = excludeEmpty({
			company: excludeEmpty({
				countryID: this.countryID,
				title: this.title.trim(),
				address: this.address.trim(),
				roles: [this.contactType],
			}),
			roles: [this.contactType],
			teamID: this.team.id,
		});
		this.isCreating = true;
		this.contactService.createContact(request).subscribe({
			next: value => {
				this.navController.pop().catch(this.errorLogger.logErrorHandler('Failed to navigate back'));
			},
			error: err => {
				this.errorLogger.logError(err, 'Failed to create contact');
				this.isCreating = false;
			},
		});
	}
}
