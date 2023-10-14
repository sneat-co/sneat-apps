import { Component, EventEmitter, Output } from '@angular/core';
import { SelectOption } from '@sneat/wizard';

@Component({
	selector: 'sneat-new-family-wizard',
	templateUrl: './new-family-wizard.component.html',
})
export class NewFamilyWizardComponent {
	@Output() ready = new EventEmitter<boolean>();

	dwelling?: string;
	relationship?: string;
	numberOfKids?: string;

	public readonly dwellingOptions: SelectOption[] = [
		{ value: 'renter', title: 'We are renting the place we live in' },
		{ value: 'owner', title: 'We own a property we live in' },
		{ value: 'separated', title: 'We do not live together (separated)' },
		{ value: 'undisclosed', title: 'I prefer not to disclose at this stage' },
	];

	public readonly relationshipOptions: SelectOption[] = [
		{ value: 'partner', title: "I'm married or have a partner" },
		{ value: 'single', title: 'I am single' },
		{ value: 'child', title: 'I am a child in this family' },
		{ value: 'undisclosed', title: 'I prefer not to disclose at this stage' },
	];

	public readonly rangeOptions0to7 = [
		{ value: '0' },
		{ value: '1' },
		{ value: '2' },
		{ value: '3' },
		{ value: '4' },
		{ value: '5' },
		{ value: '6' },
		{ value: '7' },
		{ value: 'undisclosed', title: 'I prefer not to disclose at this stage' },
	];

	get isReady(): boolean {
		return !!this.relationship && !!this.numberOfKids && !!this.dwelling;
	}

	onFormChanged(): void {
		this.ready.emit(this.isReady);
	}
}
