import { Component, EventEmitter, Input, Output } from '@angular/core';
import { formNexInAnimation } from '@sneat/animations';
import { AgeGroup, emptyRelatedPerson, Gender, IRelatedPerson } from '@sneat/dto';
import { ITeamContext } from '@sneat/team/models';


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

	@Input() relatedPerson: IRelatedPerson = emptyRelatedPerson;
	@Output() readonly relatedPersonChange = new EventEmitter<IRelatedPerson>();

	showGender = false;
	showPersonProps = false;
	showRoles = false;

	isReady = false;

	@Input() hideRelationship = false;

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

	// public nextFromName(event: Event): void {
	// 	if (!this.namesFormComponent?.namesForm.valid) {
	// 		alert('Problem with names: ' + JSON.stringify(this.namesFormComponent?.namesForm.errors));
	// 		return;
	// 	}
	// 	setTimeout(() => {
	// 		const setFocus = this.genderFirstInput?.setFocus;
	// 		if (setFocus) {
	// 			setFocus(event)
	// 				.catch(this.errorLogger.logErrorHandler('failed to set focus to gender'));
	// 		}
	// 	}, 500);
	// }

}
