import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { formNexInAnimation, SpaceType } from '@sneat/core';
import { AgeGroupID } from '@sneat/contactus-core';

@Component({
	selector: 'sneat-age-group-form',
	templateUrl: 'age-group-form.component.html',
	animations: [formNexInAnimation],
	imports: [CommonModule, IonicModule, FormsModule],
})
export class AgeGroupFormComponent {
	@Input({ required: true }) spaceType?: SpaceType;
	@Input({ required: true }) ageGroup?: AgeGroupID;
	@Output() readonly ageGroupChange = new EventEmitter<
		AgeGroupID | undefined
	>();
	@Input() disabled = false;
	@Input() hidePetOption = false;
	@Input() hideCompanyOption = false;
	@Input() hideUndisclosedOption = false;

	protected onAgeGroupChanged(event: Event): void {
		event.stopPropagation();
		this.ageGroupChange.emit(this.ageGroup);
	}
}
