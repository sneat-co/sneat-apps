import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { excludeUndefined, formNexInAnimation, TeamType } from '@sneat/core';
import { IFormField } from '@sneat/core';
import {
   AgeGroupID, emptyContactBase,
   Gender,
   IEmail,
   IName,
   IPersonRequirements,
   IPhone,
   IRelatedPerson,
   isNameEmpty, MemberContactType, PetKind,
} from '@sneat/dto';
import { ITeamContext } from '@sneat/team/models';
import { AgeGroupFormComponent } from '../age-group';
import { EmailsFormComponent } from '../emails-form';
import { GenderFormComponent } from '../gender-form';
import { INamesFormFields, NamesFormComponent } from '../names-form';
import { PetKindInputComponent } from '../pet-kind';
import { PhonesFormComponent } from '../phones-form';
import { RelationshipFormComponent } from '../relationship-form';
import { RolesFormComponent } from '../roles-form';


interface personWizardState { // wizard state
   readonly contactType?: boolean;
   readonly ageGroup?: boolean;
   readonly petKind?: PetKind;
   readonly name?: boolean;
   readonly nameNext?: boolean;
   readonly gender?: boolean;
   readonly roles?: boolean;
   readonly relatedAs?: boolean;
   readonly communicationChannels?: boolean;
   readonly submitButton?: boolean;
}

type WizardStepID = keyof personWizardState;

interface WizardStepCondition {
   readonly contactTypes: MemberContactType[];
   readonly teamTypes?: TeamType[];
}

interface WizardStepFilter {
   readonly hideFor?: WizardStepCondition;
   readonly showFor?: WizardStepCondition;
}

interface WizardStepDef {
   readonly id: WizardStepID;
   readonly filter?: WizardStepFilter;
}


export type IPersonFormWizardFields = {
   [id in keyof personWizardState]: IFormField;
};


@Component({
   selector: 'sneat-person-form-wizard',
   templateUrl: './person-wizard.component.html',
   animations: [
      formNexInAnimation,
   ],
   standalone: true,
   imports: [
      CommonModule,
      IonicModule,
      AgeGroupFormComponent,
      PetKindInputComponent,
      GenderFormComponent,
      RelationshipFormComponent,
      NamesFormComponent,
      RolesFormComponent,
      FormsModule,
      PhonesFormComponent,
      EmailsFormComponent,
   ],
})
export class PersonWizardComponent implements OnChanges {

   @Input({ required: true }) team?: ITeamContext;

   @Input() requires: IPersonRequirements = {};
   @Input() disabled = false;
   @Input() hideRelationship = false;
   @Input() hidePetOption = true;

   @Input() displayAgeGroupValue = false;

   @Input() nameFields: INamesFormFields = {
      nickName: { hide: true, required: false },
      firstName: { hide: true },
      lastName: { hide: true },
      middleName: { hide: true },
      fullName: { hide: false, required: false },
   };

   @Input() fields: IPersonFormWizardFields = {};

   @Input() newPerson: IRelatedPerson = emptyContactBase;
   @Output() readonly newPersonChange = new EventEmitter<IRelatedPerson>();

   public isReadyToSubmit = false;
   @Output() readonly isReadyToSubmitChange = new EventEmitter<boolean>();

   public show: personWizardState = {};

   public wizardStep: WizardStepID = 'contactType';

   tab?: 'emails' | 'phones' = 'emails';

   @ViewChild(NamesFormComponent) namesFormComponent?: NamesFormComponent;
   @ViewChild(GenderFormComponent) genderFormComponent?: GenderFormComponent;


   private readonly formOrder: readonly WizardStepDef[] = [
      { id: 'contactType' },
      { id: 'ageGroup' },
      { id: 'petKind', filter: { showFor: { contactTypes: ['animal'] } } },
      { id: 'gender' },
      // relatedAs to current user or a specific contact
      { id: 'relatedAs', filter: { hideFor: { contactTypes: ['animal'] } } },
      { id: 'name' },
      { id: 'roles', filter: { hideFor: { contactTypes: ['animal'], teamTypes: ['family'] } } },
      { id: 'communicationChannels', filter: { hideFor: { contactTypes: ['animal'] } } },
      { id: 'submitButton' },
   ];

   ngOnChanges(changes: SimpleChanges): void {
      console.log('PersonFormComponent.ngOnChanges()', changes);
      if (changes['relatedPerson']) {
         if (this.wizardStep === 'contactType') {
            if (this.newPerson.type) {
               this.onContactTypeChanged();
               this.setRelatedPerson(this.newPerson, { name: 'contactType', hasValue: true });
            }
            if (this.newPerson.ageGroup || this.newPerson.type === 'animal') {
               this.show = { ...this.show, ageGroup: this.displayAgeGroupValue };
               this.setRelatedPerson(this.newPerson, { name: 'ageGroup', hasValue: true });
            }
         }
      }
      if (changes['fields']) {
         this.openNext('contactType');
      }
   }


   private setRelatedPerson(relatedPerson: IRelatedPerson, changedProp: {
      name: WizardStepID;
      hasValue: boolean
   }): void {
      this.newPerson = relatedPerson;
      this.newPersonChange.emit(relatedPerson);
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
         { ...this.newPerson, name },
         { name: 'name', hasValue: false },
      );
   }

   protected onPetKindChanged(petKind?: PetKind): void {
      console.log('onPetKindChanged()', petKind);
      this.setRelatedPerson(
         { ...this.newPerson, petKind },
         { name: 'petKind', hasValue: !!petKind },
      );
   }

   protected onGenderChanged(gender?: Gender): void {
      this.setRelatedPerson(
         { ...this.newPerson, gender },
         { name: 'gender', hasValue: !!gender },
      );
   }

   private onContactTypeChanged(): void {
      switch (this.newPerson.type) {
         case 'animal':
            this.nameFields = {
               ...this.nameFields,
               nickName: { hide: false, required: true },
               firstName: { hide: true },
               lastName: { hide: true },
               middleName: { hide: true },
            };
            break;
         case 'person':
            this.nameFields = {
               ...this.nameFields,
               nickName: { hide: true, required: false },
               firstName: { hide: false },
               lastName: { hide: false },
               middleName: { hide: false },
            };
            break;
      }
   }

   protected onAgeGroupChanged(ageGroup?: AgeGroupID): void {
      console.log('onAgeGroupChanged()', ageGroup);
      if (ageGroup) {
         this.show = { ...this.show, ageGroup: this.displayAgeGroupValue };
      }
      if (ageGroup === 'pet') {
         this.newPerson = { ...this.newPerson, type: 'animal' };
         this.onContactTypeChanged();
      } else if (this.newPerson.type !== 'person') {
         this.newPerson = { ...this.newPerson, type: 'person' };
         this.onContactTypeChanged();
      }
      const relatedPerson: IRelatedPerson = excludeUndefined({
         ...this.newPerson,
         ageGroup: ageGroup === 'pet' ? undefined : ageGroup,
         type: ageGroup === 'pet' ? 'animal' : 'person',
      });
      this.setRelatedPerson(relatedPerson, {
         name: 'ageGroup',
         hasValue: !!ageGroup || this.newPerson.type === 'animal',
      });
   }

   protected onEmailsChanged(emails: IEmail[]): void {
      this.setRelatedPerson(
         { ...this.newPerson, emails },
         { name: 'communicationChannels', hasValue: !!emails?.length || !!this.newPerson.phones?.length },
      );
   }

   protected onPhoneChanged(phones: IPhone[]): void {
      this.setRelatedPerson(
         { ...this.newPerson, phones },
         { name: 'communicationChannels', hasValue: !!phones?.length || !!this.newPerson.emails?.length },
      );
   }

   protected onRelationshipChanged(relatedAs: string): void {
      console.log('onRelationshipChanged()', relatedAs);
      this.setRelatedPerson(
         { ...this.newPerson, relatedTo: { relatedAs: relatedAs } },
         { name: 'relatedAs', hasValue: !!relatedAs },
      );
      if (!this.newPerson.ageGroup) {
         const relationship = this.newPerson.relatedTo?.relatedAs;
         if (relationship === 'parent' || relationship === 'spouse' || relationship === 'partner' || relationship === 'grandparent') {
            this.setRelatedPerson(
               { ...this.newPerson, ageGroup: 'adult' },
               { name: 'relatedAs', hasValue: true },
            );
         } else if (relationship === 'child') {
            this.setRelatedPerson(
               { ...this.newPerson, ageGroup: 'child' },
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
      if (this.newPerson.type) {
         if (step.filter.hideFor?.contactTypes?.includes(this.newPerson.type as MemberContactType)) {
            return true;
         }
         if (step.filter.showFor?.contactTypes?.length && !step.filter.showFor.contactTypes.includes(this.newPerson.type as MemberContactType)) {
            return true;
         }
      }
      if (this.team?.type) {
         if (step.filter.hideFor?.teamTypes?.includes(this.team.type)) {
            return true;
         }
         if (step.filter.showFor?.teamTypes?.length && !step.filter.showFor.teamTypes.includes(this.team.type)) {
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
            const nextField = this.fields[nextStep.id];
            const showNextField = nextField ? !nextField.hide : true;
            this.show = { ...this.show, [nextStep.id]: showNextField };
            if (!showNextField) {
               this.openNext(nextStep.id);
            }
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
      const p = this.newPerson;
      switch (name) {
         case 'name':
            return !!p.name && Object.values(p.name).some(v => !!v);
         case 'ageGroup':
            return !!p.ageGroup;
         case 'gender':
            return !!p.gender;
         case 'relatedAs':
            return !!p.relatedTo?.relatedAs;
         case 'roles':
            return !!p.roles?.length;
      }
      return undefined;
   }
}
