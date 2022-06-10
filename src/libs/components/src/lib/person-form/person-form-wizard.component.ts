import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { formNexInAnimation } from '@sneat/animations';
import {
	AgeGroup,
	emptyRelatedPerson,
	Gender,
	IEmail,
	IName,
	IPersonRequirements,
	IPhone,
	IRelatedPerson,
	isNameEmpty,
} from '@sneat/dto';
import { ITeamContext } from '@sneat/team/models';
import { IFormField } from '@sneat/core';
import { GenderFormComponent } from './gender-form/gender-form.component';
import { INamesFormFields, NamesFormComponent } from './names-form/names-form.component';


interface personWizardState { // wizard state
	readonly name: boolean;
	readonly nameNext?: boolean;
	readonly gender?: boolean;
	readonly ageGroup?: boolean;
	readonly roles?: boolean;
	readonly relatedAs?: boolean;
	readonly phones?: boolean;
	readonly emails?: boolean;
	readonly submitButton?: boolean;
}

type WizardItem = keyof personWizardState;

export interface IPersonFormWizardFields extends INamesFormFields {
	relatedAs?: IFormField
}

@Component({
	selector: 'sneat-person-form-wizard',
	templateUrl: 'person-form-wizard.component.html',
	animations: [
		formNexInAnimation,
	],
})
export class PersonFormWizardComponent {

	@Input() requires: IPersonRequirements = {};
	@Input() team?: ITeamContext;
	@Input() disabled = false;
	@Input() hideRelationship = false;

	@Input() fields?: IPersonFormWizardFields;

	@Input() relatedPerson: IRelatedPerson = emptyRelatedPerson;
	@Output() readonly relatedPersonChange = new EventEmitter<IRelatedPerson>();

	public isReadyToSubmit = false;
	@Output() readonly isReadyToSubmitChange = new EventEmitter<boolean>();

	public show: personWizardState = { name: false, gender: true };

	public wizardStep: keyof personWizardState = 'name';

	@ViewChild(NamesFormComponent) namesFormComponent?: NamesFormComponent;
	@ViewChild(GenderFormComponent) genderFormComponent?: GenderFormComponent;

	private readonly formOrder: readonly (keyof personWizardState)[] = [
		'name',
		'gender',
		'ageGroup',
		'relatedAs',
		// 'roles',
		'emails',
		'phones',
		'submitButton',
	];

	private showRestOfTheForm(): boolean {
		const p = this.relatedPerson;
		return !!p.ageGroup && (this.hideRelationship || !!p.relationship);
	}


	private setRelatedPerson(relatedPerson: IRelatedPerson, changedProp: { name: keyof personWizardState; hasValue: boolean }): void {
		this.relatedPerson = relatedPerson;
		this.relatedPersonChange.emit(relatedPerson);
		if (changedProp.hasValue) {
			this.openNext(changedProp.name);
		}
	}

	onNameChanged(name: IName): void {
		console.log('PersonFormComponent.onNameChanged()', name);
		if (!this.show.nameNext && !isNameEmpty(name)) {
			this.show = {...this.show, nameNext: true};
		}
		this.setRelatedPerson(
			{ ...this.relatedPerson, name },
			{ name: 'name', hasValue: false },
		);
	}

	onGenderChanged(gender?: Gender): void {
		this.show = {...this.show, name: true};
		this.setRelatedPerson(
			{ ...this.relatedPerson, gender },
			{ name: 'gender', hasValue: !!gender },
		);
	}


	onAgeGroupChanged(ageGroup?: AgeGroup): void {
		this.setRelatedPerson(
			{ ...this.relatedPerson, ageGroup },
			{ name: 'ageGroup', hasValue: !!ageGroup },
		);
	}

	onEmailsChanged(emails: IEmail[]): void {
		this.setRelatedPerson(
			{ ...this.relatedPerson, emails },
			{ name: 'emails', hasValue: !!emails?.length },
		);
	}

	onPhoneChanged(phones: IPhone[]): void {
		this.setRelatedPerson(
			{ ...this.relatedPerson, phones },
			{ name: 'phones', hasValue: !!phones?.length },
		);
	}

	onRelationshipChanged(relationship: string): void {
		console.log('onRelationshipChanged()', relationship);
		this.setRelatedPerson(
			{ ...this.relatedPerson, relationship },
			{ name: 'relatedAs', hasValue: !!relationship },
		);
		if (!this.relatedPerson.ageGroup) {
			const relationship = this.relatedPerson.relationship;
			if (relationship === 'parent' || relationship === 'spouse' || relationship === 'partner' || relationship === 'grandparent') {
				this.setRelatedPerson(
					{ ...this.relatedPerson, ageGroup: 'adult' },
					{ name: 'relatedAs', hasValue: true },
				);
			} else if (relationship === 'child') {
				this.setRelatedPerson(
					{ ...this.relatedPerson, ageGroup: 'child' },
					{ name: 'relatedAs', hasValue: true },
				);
			}
		}
	}

	public nextFromName(event: Event): void {
		event.stopPropagation();

		if (!this.namesFormComponent) {
			throw Error('!namesFormComponent');
		}
		if (!this.namesFormComponent.namesForm) {
			throw Error('!namesFormComponent.namesForm');
		}

		this.namesFormComponent.namesForm.markAllAsTouched();
		if (!this.namesFormComponent.namesForm.valid) {
			alert('Problem with names: ' + JSON.stringify(this.namesFormComponent?.namesForm.errors));
			return;
		}
		this.openNext('name');
	}

	public openNext(changedPropName: keyof personWizardState): void {
		for (;;) {
			console.log('openNext()', changedPropName);
			const i = this.formOrder.indexOf(changedPropName);
			if (i < 0) {
				console.log(`openNext have not found ${changedPropName} in this.formOrder=${this.formOrder.join(',')}`);
				return;
			}
			if (i === this.formOrder.length - 1) {  // last element
				console.log('openNext reached last element')
				return;
			}
			const nextName = this.formOrder[i+1];
			if (this.requires[nextName as keyof IPersonRequirements] !== 'excluded') {
				if (!this.show[nextName]) {
					this.show = {...this.show, [nextName]: true};
					this.wizardStep = nextName;
				}
				break;
			}
			changedPropName = nextName;
		}
		if (this.show.submitButton) {
			this.isReadyToSubmit = true;
			this.isReadyToSubmitChange.emit();
		}
	}
}
