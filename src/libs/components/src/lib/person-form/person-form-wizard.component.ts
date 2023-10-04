import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { excludeUndefined, formNexInAnimation } from '@sneat/core';
import { IFormField } from '@sneat/core';
import {
	AgeGroupID,
	emptyMemberPerson,
	Gender,
	IEmail,
	IName,
	IPersonRequirements,
	IPhone,
	IRelatedPerson,
	isNameEmpty, MemberContactType, PetKind,
} from '@sneat/dto';
import { ITeamContext } from '@sneat/team/models';
import { GenderFormComponent } from './gender-form/gender-form.component';
import { INamesFormFields, NamesFormComponent } from './names-form/names-form.component';


interface personWizardState { // wizard state
	readonly ageGroup?: boolean;
	readonly petKind?: PetKind;
	readonly name?: boolean;
	readonly nameNext?: boolean;
	readonly gender?: boolean;
	readonly roles?: boolean;
	readonly relatedAs?: boolean;
	readonly phones?: boolean;
	readonly emails?: boolean;
	readonly submitButton?: boolean;
}

type WizardStepID = keyof personWizardState;

interface WizardStepCondition {
	readonly contactTypes: MemberContactType[];
}

interface WizardStepFilter {
	readonly hideFor?: WizardStepCondition;
	readonly showFor?: WizardStepCondition;
}

interface WizardStepDef {
	readonly id: WizardStepID;
	readonly filter?: WizardStepFilter;
}


export interface IPersonFormWizardFields extends INamesFormFields {
	relatedAs?: IFormField;
}

@Component({
	selector: 'sneat-person-form-wizard',
	templateUrl: 'person-form-wizard.component.html',
	animations: [
		formNexInAnimation,
	],
})
export class PersonFormWizardComponent {

	@Input({ required: true }) team?: ITeamContext;

	@Input() requires: IPersonRequirements = {};
	@Input() disabled = false;
	@Input() hideRelationship = false;

	@Input() fields?: IPersonFormWizardFields = {
		nickName: { hide: true, required: false },
		firstName: { hide: true },
		lastName: { hide: true },
		middleName: { hide: true },
		fullName: { hide: false, required: false },
	};

	@Input() relatedPerson: IRelatedPerson = emptyMemberPerson;
	@Output() readonly relatedPersonChange = new EventEmitter<IRelatedPerson>();

	public isReadyToSubmit = false;
	@Output() readonly isReadyToSubmitChange = new EventEmitter<boolean>();

	public show: personWizardState = { ageGroup: true };

	public wizardStep: WizardStepID = 'ageGroup';

	tab?: 'emails' | 'phones' = 'emails';

	@ViewChild(NamesFormComponent) namesFormComponent?: NamesFormComponent;
	@ViewChild(GenderFormComponent) genderFormComponent?: GenderFormComponent;


	private readonly formOrder: readonly WizardStepDef[] = [
		{ id: 'ageGroup' },
		{ id: 'petKind', filter: { showFor: { contactTypes: ['person'] } } },
		{ id: 'gender' },
		{ id: 'name' },
		{ id: 'relatedAs', filter: { hideFor: { contactTypes: ['animal'] } } },
		{ id: 'roles', filter: { hideFor: { contactTypes: ['animal'] } } },
		{ id: 'emails', filter: { hideFor: { contactTypes: ['animal'] } } },
		{ id: 'phones', filter: { hideFor: { contactTypes: ['animal'] } } },
		{ id: 'submitButton' },
	];

	private setRelatedPerson(relatedPerson: IRelatedPerson, changedProp: {
		name: WizardStepID;
		hasValue: boolean
	}): void {
		this.relatedPerson = relatedPerson;
		this.relatedPersonChange.emit(relatedPerson);
		if (changedProp.hasValue) {
			this.openNext(changedProp.name);
		}
	}

	protected onNameChanged(name: IName): void {
		console.log('PersonFormComponent.onNameChanged()', name);
		if (!this.show.nameNext && !isNameEmpty(name)) {
			this.show = { ...this.show, nameNext: true };
		}
		this.setRelatedPerson(
			{ ...this.relatedPerson, name },
			{ name: 'name', hasValue: false },
		);
	}

	protected onPetKindChanged(petKind?: PetKind): void {
		console.log('onPetKindChanged()', petKind);
		this.setRelatedPerson(
			{ ...this.relatedPerson, petKind },
			{ name: 'petKind', hasValue: !!petKind },
		);
	}

	protected onGenderChanged(gender?: Gender): void {
		this.setRelatedPerson(
			{ ...this.relatedPerson, gender },
			{ name: 'gender', hasValue: !!gender },
		);
	}


	protected onAgeGroupChanged(ageGroup?: AgeGroupID): void {
		if (ageGroup === 'pet') {
			this.fields = {
				...this.fields,
				nickName: { hide: false, required: true },
				firstName: { hide: true },
				lastName: { hide: true },
				middleName: { hide: true },
			};
		} else {
			this.fields = {
				...this.fields,
				nickName: { hide: true, required: false },
				firstName: { hide: false },
				lastName: { hide: false },
				middleName: { hide: false },
			};
		}
		this.setRelatedPerson(
			excludeUndefined({
				...this.relatedPerson,
				ageGroup: ageGroup === 'pet' ? undefined : ageGroup,
				type: ageGroup === 'pet' ? 'animal' : 'person',
			}),
			{ name: 'ageGroup', hasValue: !!ageGroup },
		);
	}

	protected onEmailsChanged(emails: IEmail[]): void {
		this.setRelatedPerson(
			{ ...this.relatedPerson, emails },
			{ name: 'emails', hasValue: !!emails?.length },
		);
	}

	protected onPhoneChanged(phones: IPhone[]): void {
		this.setRelatedPerson(
			{ ...this.relatedPerson, phones },
			{ name: 'phones', hasValue: !!phones?.length },
		);
	}

	protected onRelationshipChanged(relationship: string): void {
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

	protected nextFromName(event: Event): void {
		event.stopPropagation();

		if (!this.namesFormComponent) {
			throw Error('!namesFormComponent');
		}
		if (!this.namesFormComponent.namesForm) {
			throw Error('!namesFormComponent.namesForm');
		}

		this.namesFormComponent.namesForm.markAllAsTouched();
		if (!this.namesFormComponent.namesForm.valid) {
			const errors = this.namesFormComponent?.namesForm.errors;
			if (errors) {
				alert('Problem with names:\n' + Object.entries(errors).map(err => `\t${err[0]}: ${err[1]}`).join('\n'));
			}
			return;
		}
		this.openNext('name');
		this.show = { ...this.show, nameNext: false };
	}

	private skipStep(step: WizardStepDef): boolean {
		if (!step.filter || !step.filter.hideFor && !step.filter.showFor) {
			return false;
		}
		if (this.relatedPerson.ageGroup) {
			if (step.filter.hideFor?.contactTypes?.includes(this.relatedPerson.type as MemberContactType)) {
				return true;
			}
			if (step.filter.showFor?.contactTypes && !step.filter.showFor.contactTypes?.includes(this.relatedPerson.type as MemberContactType)) {
				return true;
			}
		}
		return false;
	}

	public openNext(currentStepID: keyof personWizardState): void {
		for (; ;) {
			console.log('openNext()', currentStepID);
			const i = this.formOrder.findIndex(step => step.id === currentStepID);
			if (i < 0) {
				console.log(`openNext have not found ${currentStepID} in this.formOrder=${this.formOrder.join(',')}`);
				return;
			}
			if (i === this.formOrder.length - 1) {  // last element
				console.log('openNext reached last element');
				return;
			}
			const nextStep = this.formOrder[i + 1];
			if (this.skipStep(nextStep)) {
				currentStepID = nextStep.id;
				continue;
			}

			if (!this.show[nextStep.id]) {
				this.show = { ...this.show, [nextStep.id]: true };
				this.wizardStep = nextStep.id;
				if (this.stepHasValue(nextStep.id)) {
					currentStepID = nextStep.id;
					continue;
				}
			}
			break; // <---------- Exit point
		}
		if (this.show.submitButton) {
			this.isReadyToSubmit = true;
			this.isReadyToSubmitChange.emit();
		}
	}

	private stepHasValue(name: WizardStepID): boolean | undefined {
		const p = this.relatedPerson;
		switch (name) {
			case 'name':
				return !!p.name && Object.values(p.name).some(v => !!v);
			case 'ageGroup':
				return !!p.ageGroup;
			case 'gender':
				return !!p.gender;
			case 'relatedAs':
				return !!p.relationship;
			case 'roles':
				return !!p.roles?.length;
		}
		return undefined;
	}
}
