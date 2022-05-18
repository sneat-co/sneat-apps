import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { formNexInAnimation } from '@sneat/animations';
import { NamesFormComponent } from '@sneat/components';
import { AgeGroup, emptyRelatedPerson, Gender, IRelatedPerson } from '@sneat/dto';
import { ITeamContext } from '@sneat/team/models';
import { GenderFormComponent } from './gender-form/gender-form.component';


@Component({
	selector: 'sneat-person-form',
	templateUrl: 'person-form.component.html',
	animations: [
		formNexInAnimation,
	],
})
export class PersonFormComponent {

	@Input() team?: ITeamContext;
	@Input() disabled = false;
	@Input() hideRelationship = false;

	@Input() relatedPerson: IRelatedPerson = emptyRelatedPerson;
	@Output() readonly relatedPersonChange = new EventEmitter<IRelatedPerson>();

	showGender = false;
	showPersonProps = false;
	showRoles = false;

	@ViewChild(NamesFormComponent) namesFormComponent?: NamesFormComponent;
	@ViewChild(GenderFormComponent) genderFormComponent?: GenderFormComponent;

	get showRelationship() {
		return !this.hideRelationship && this.relatedPerson.gender && this.relatedPerson.ageGroup;
	};

	get showPhones(): boolean {
		return this.showRestOfTheForm();
	};

	get showEmails(): boolean {
		return this.showRestOfTheForm();
	};

	private showRestOfTheForm(): boolean {
		const p = this.relatedPerson;
		return !!p.ageGroup && (this.hideRelationship || !!p.relationship);
	}


	private setRelatedPerson(myPerson: IRelatedPerson): void {
		this.relatedPerson = myPerson;
		this.relatedPersonChange.emit(myPerson);
	}

	onGenderChanged(gender?: Gender): void {
		this.setRelatedPerson({ ...this.relatedPerson, gender });
		this.showPersonProps = true;
	}

	onAgeGroupChanged(ageGroup?: AgeGroup): void {
		this.setRelatedPerson({ ...this.relatedPerson, ageGroup });
	}

	onRelationshipChanged(relationship: string): void {
		console.log('onRelationshipChanged()', relationship);
		this.setRelatedPerson({ ...this.relatedPerson, relationship });
		if (!this.relatedPerson.ageGroup) {
			const relationship = this.relatedPerson.relationship;
			if (relationship === 'parent' || relationship === 'spouse' || relationship === 'partner' || relationship === 'grandparent') {
				this.setRelatedPerson({ ...this.relatedPerson, ageGroup: 'adult' });
			} else if (relationship === 'child') {
				this.setRelatedPerson({ ...this.relatedPerson, ageGroup: 'child' });
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
		this.showGender = true;
	}

}
