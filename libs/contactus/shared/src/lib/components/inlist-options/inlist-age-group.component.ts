import { Component, Input, inject } from '@angular/core';
import {
	ContactService,
	IUpdateContactRequest,
} from '@sneat/contactus-services';
import { AgeGroupID } from '@sneat/core';
import { WithSpaceInput } from '@sneat/space-services';
import {
	OptionEvent,
	Option,
	InlistOptionsComponent,
} from './inlist-options.component';

@Component({
	selector: 'sneat-inlist-age-group',
	template:
		'<sneat-inlist-options [options]="ageOptions" [selectedOption]="selectedOption" (optionSelected)="onAgeGroupSelected($event)"/>',
	imports: [InlistOptionsComponent],
})
export class InlistAgeGroupComponent extends WithSpaceInput {
	private readonly contactService = inject(ContactService);

	constructor() {
		super('InlistAgeGroupComponent');
	}

	protected selectedOption?: Option;

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
		const spaceID = this.$spaceID();
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
