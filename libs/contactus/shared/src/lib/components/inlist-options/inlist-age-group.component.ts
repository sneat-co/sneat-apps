import { Component, Inject, Input } from '@angular/core';
import { AgeGroupID } from '@sneat/contactus-core';
import {
	ContactService,
	IUpdateContactRequest,
} from '@sneat/contactus-services';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/team-models';
import {
	OptionEvent,
	Option,
	InlistOptionsComponent,
} from './inlist-options.component';

@Component({
	selector: 'sneat-inlist-age-group',
	template:
		'<sneat-inlist-options [options]="ageOptions" [selectedOption]="selectedOption" (optionSelected)="onAgeGroupSelected($event)"/>',
	standalone: true,
	imports: [InlistOptionsComponent],
})
export class InlistAgeGroupComponent {
	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly contactService: ContactService,
	) {}

	protected selectedOption?: Option;

	@Input({ required: true }) public space?: ISpaceContext;
	@Input({ required: true }) public contactID = '';

	protected readonly ageOptions: readonly Option[] = [
		{ id: 'adult', title: 'Adult' },
		{ id: 'child', title: 'Child' },
	];

	protected onAgeGroupSelected(optionEvent: OptionEvent): void {
		console.log(
			'MembersListComponent.setAgeGroup()',
			this.contactID,
			optionEvent.option.id,
		);
		optionEvent.uiEvent.preventDefault();
		optionEvent.uiEvent.stopPropagation();
		this.selectedOption = optionEvent.option;
		const spaceID = this.space?.id;
		if (!spaceID) {
			return;
		}
		const request: IUpdateContactRequest = {
			spaceID,
			contactID: this.contactID,
			ageGroup: optionEvent.option.id as AgeGroupID,
		};
		this.contactService.updateContact(request).subscribe({
			next: () => console.log('age group updated'),
			error: (err) => {
				this.errorLogger.logError(
					err,
					'failed to update contact with age group',
				);
				setTimeout(() => (this.selectedOption = undefined), 500);
			},
		});
	}
}
