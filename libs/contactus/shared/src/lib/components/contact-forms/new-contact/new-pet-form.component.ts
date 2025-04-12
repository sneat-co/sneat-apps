import { Component } from '@angular/core';
import { NewContactBaseFormComponent } from './new-contact-base-form-component';

@Component({
	selector: 'sneat-new-pet-form',
	templateUrl: './new-pet-form.component.html',
})
export class NewPetFormComponent extends NewContactBaseFormComponent {
	public constructor() {
		super('NewPetFormComponent');
	}
}
