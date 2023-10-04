import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { formNexInAnimation } from '@sneat/core';
import { IFormField } from '@sneat/core';
import {
  AgeGroupID,
  emptyRelatedPerson,
  Gender,
  IEmail,
  IName,
  IPersonRequirements,
  IPhone,
  IRelatedPerson,
  isNameEmpty, PetKind,
} from '@sneat/dto';
import { ITeamContext } from '@sneat/team/models';
import { GenderFormComponent } from './gender-form/gender-form.component';
import { INamesFormFields, NamesFormComponent } from './names-form/names-form.component';


interface personWizardState { // wizard state
  readonly ageGroup?: boolean;
  readonly name?: boolean;
  readonly petKind?: PetKind;
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
  ageGroupIDs: AgeGroupID[];
}

interface WizardStepFilter {
  hideFor?: WizardStepCondition;
  showFor?: WizardStepCondition;
}

interface WizardStep {
  id: WizardStepID;
  filter?: WizardStepFilter;
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

  @Input() relatedPerson: IRelatedPerson = emptyRelatedPerson;
  @Output() readonly relatedPersonChange = new EventEmitter<IRelatedPerson>();

  public isReadyToSubmit = false;
  @Output() readonly isReadyToSubmitChange = new EventEmitter<boolean>();

  public show: personWizardState = { ageGroup: true };

  public wizardStep: WizardStepID = 'name';

  tab?: 'emails' | 'phones' = 'emails';

  @ViewChild(NamesFormComponent) namesFormComponent?: NamesFormComponent;
  @ViewChild(GenderFormComponent) genderFormComponent?: GenderFormComponent;


  private readonly formOrder: readonly WizardStep[] = [
	 { id: 'ageGroup' },
	 { id: 'petKind', filter: { showFor: { ageGroupIDs: ['pet'] } } },
	 { id: 'name' },
	 { id: 'gender' },
	 { id: 'relatedAs', filter: { hideFor: { ageGroupIDs: ['pet'] } } },
	 { id: 'roles', filter: { hideFor: { ageGroupIDs: ['pet'] } } },
	 { id: 'emails', filter: { hideFor: { ageGroupIDs: ['pet'] } } },
	 { id: 'phones', filter: { hideFor: { ageGroupIDs: ['pet'] } } },
	 { id: 'submitButton' },
  ];

  private showRestOfTheForm(): boolean {
	 const p = this.relatedPerson;
	 return !!p.ageGroup && (this.hideRelationship || !!p.relationship);
  }


  private setRelatedPerson(relatedPerson: IRelatedPerson, changedProp: { name: WizardStepID; hasValue: boolean }): void {
	 this.relatedPerson = relatedPerson;
	 this.relatedPersonChange.emit(relatedPerson);
	 if (changedProp.hasValue) {
		this.openNext(changedProp.name);
	 }
  }

  onNameChanged(name: IName): void {
	 console.log('PersonFormComponent.onNameChanged()', name);
	 if (!this.show.nameNext && !isNameEmpty(name)) {
		this.show = { ...this.show, nameNext: true };
	 }
	 this.setRelatedPerson(
		{ ...this.relatedPerson, name },
		{ name: 'name', hasValue: false },
	 );
  }

  onPetKindChanged(petKind?: PetKind): void {
	 this.setRelatedPerson(
		{ ...this.relatedPerson, petKind },
		{ name: 'petKind', hasValue: !!petKind },
	 );
	 if (petKind) {
		this.openNext('petKind');
	 }
  }

  onGenderChanged(gender?: Gender): void {
	 this.setRelatedPerson(
		{ ...this.relatedPerson, gender },
		{ name: 'gender', hasValue: !!gender },
	 );
	 this.openNext('gender');
  }


  onAgeGroupChanged(ageGroup?: AgeGroupID): void {
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
	 this.show = { ...this.show, nameNext: false };
  }

  public openNext(changedPropName: keyof personWizardState): void {
	 for (; ;) {
		console.log('openNext()', changedPropName);
		const i = this.formOrder.findIndex(step => step.id === changedPropName);
		if (i < 0) {
		  console.log(`openNext have not found ${changedPropName} in this.formOrder=${this.formOrder.join(',')}`);
		  return;
		}
		if (i === this.formOrder.length - 1) {  // last element
		  console.log('openNext reached last element');
		  return;
		}
		const nextName = this.formOrder[i + 1].id;
		changedPropName = nextName;
		if (!this.requires[nextName as keyof IPersonRequirements]?.hide) {
		  if (!this.show[nextName]) {
			 this.show = { ...this.show, [nextName]: true };
			 this.wizardStep = nextName;
			 if (this.hasValue(nextName)) {
				continue;
			 }
		  }

		  break; // <---------- Exit point
		}
	 }
	 if (this.show.submitButton) {
		this.isReadyToSubmit = true;
		this.isReadyToSubmitChange.emit();
	 }
  }

  private hasValue(name: WizardStepID): boolean | undefined {
	 switch (name) {
		case 'ageGroup':
		  return !!this.relatedPerson.ageGroup;
		case 'gender':
		  return !!this.relatedPerson.gender;
		case 'relatedAs':
		  return !!this.relatedPerson.relationship;
		case 'roles':
		  return !!this.relatedPerson.roles?.length;
	 }
	 return undefined;
  }
}
