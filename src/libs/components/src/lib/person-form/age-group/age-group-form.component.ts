import { Component, EventEmitter, Input, Output } from '@angular/core';
import { formNexInAnimation, TeamType } from '@sneat/core';
import { AgeGroupID } from '@sneat/dto';

@Component({
	selector: 'sneat-age-group-form',
	templateUrl: 'age-group-form.component.html',
	animations: [
		formNexInAnimation,
	],
})
export class AgeGroupFormComponent {
	@Input({ required: true }) teamType?: TeamType;
	@Input({ required: true }) ageGroup?: AgeGroupID;
	@Output() readonly ageGroupChange = new EventEmitter<AgeGroupID | undefined>();
	@Input() disabled = false;

	onAgeGroupChanged(event: Event): void {
		event.stopPropagation();
		this.ageGroupChange.emit(this.ageGroup);
	}
}
