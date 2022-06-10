import { Component, EventEmitter, Input, Output } from '@angular/core';
import { formNexInAnimation } from '@sneat/animations';
import { AgeGroup } from '@sneat/dto';

@Component({
	selector: 'sneat-age-group-form',
	templateUrl: 'age-group-form.component.html',
	animations: [
		formNexInAnimation,
	],
})
export class AgeGroupFormComponent {
	@Input() disabled = false;
	@Input() ageGroup?: AgeGroup;
	@Output() readonly ageGroupChange = new EventEmitter<AgeGroup|undefined>();

	onAgeGroupChanged(event: Event): void {
		event.stopPropagation();
		this.ageGroupChange.emit(this.ageGroup)
	}
}
