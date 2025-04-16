import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
	IonButton,
	IonCard,
	IonInput,
	IonItem,
	IonLabel,
} from '@ionic/angular/standalone';
import { NewContactBaseDboAndSpaceRef } from '@sneat/contactus-core';
import { PetKindAndBreedFormComponent } from '../pet-kind-and-breed-form/pet-kind-and-breed-form.component';
import { NewContactFormBaseComponent } from './new-contact-form-base.component';

@Component({
	selector: 'sneat-new-pet-form',
	templateUrl: './new-pet-form.component.html',
	imports: [
		IonItem,
		IonInput,
		IonCard,
		PetKindAndBreedFormComponent,
		IonButton,
		IonLabel,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewPetFormComponent extends NewContactFormBaseComponent {
	public constructor() {
		super('NewPetFormComponent');
	}

	protected onContactChanged(contact: NewContactBaseDboAndSpaceRef): void {
		this.contactChange.emit(contact);
	}
}
