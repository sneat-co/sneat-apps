import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { formNexInAnimation, TeamType } from '@sneat/core';
import { AgeGroupID } from '@sneat/dto';

@Component({
	selector: 'sneat-age-group-form',
	templateUrl: 'age-group-form.component.html',
	animations: [formNexInAnimation],
	standalone: true,
	imports: [CommonModule, IonicModule, FormsModule],
})
export class AgeGroupFormComponent {
	@Input({ required: true }) teamType?: TeamType;
	@Input({ required: true }) ageGroup?: AgeGroupID;
	@Output() readonly ageGroupChange = new EventEmitter<
		AgeGroupID | undefined
	>();
	@Input() disabled = false;
	@Input() hidePetOption = false;
	@Input() hideCompanyOption = false;
	@Input() hideUndisclosedOption = false;

	onAgeGroupChanged(event: Event): void {
		event.stopPropagation();
		this.ageGroupChange.emit(this.ageGroup);
	}
}
