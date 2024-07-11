import { Component, Inject, Input } from '@angular/core';
import { AgeGroupID } from '@sneat/contactus-core';
import {
	ContactService,
	IUpdateContactRequest,
} from '@sneat/contactus-services';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/team-models';
import { IdEvent, InlistOptionsComponent } from './inlist-options.component';

@Component({
	selector: 'sneat-inlist-age-group',
	template:
		'<sneat-inlist-options [options]="ageOptions" (optionSelected)="onAgeGroupSelected($event)"/>',
	standalone: true,
	imports: [InlistOptionsComponent],
})
export class InlistAgeGroupComponent {
	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly contactService: ContactService,
	) {}

	@Input({ required: true }) public team?: ISpaceContext;
	@Input({ required: true }) public contactID = '';

	protected readonly ageOptions: { id: string; title: string }[] = [
		{ id: 'adult', title: 'Adult' },
		{ id: 'child', title: 'Child' },
	];

	protected onAgeGroupSelected(idEvent: IdEvent): void {
		console.log(
			'MembersListComponent.setAgeGroup()',
			this.contactID,
			idEvent.id,
		);
		idEvent.uiEvent.preventDefault();
		idEvent.uiEvent.stopPropagation();
		const teamID = this.team?.id;
		if (!teamID) {
			return;
		}
		const request: IUpdateContactRequest = {
			spaceID: teamID,
			contactID: this.contactID,
			ageGroup: idEvent.id as AgeGroupID,
		};
		this.contactService.updateContact(request).subscribe({
			next: () => console.log('age group updated'),
			error: this.errorLogger.logErrorHandler(
				'failed to update contact with age group',
			),
		});
	}
}
