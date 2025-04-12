import { ChangeDetectionStrategy, Component } from '@angular/core';
import {
	IonCard,
	IonInput,
	IonItem,
	IonLabel,
} from '@ionic/angular/standalone';
import { ContactTypeAnimal, PetKind } from '@sneat/contactus-core';
import { ISelectItem, SelectFromListComponent } from '@sneat/ui';
import { NewContactBaseFormComponent } from './new-contact-base-form-component';

@Component({
	selector: 'sneat-new-pet-form',
	templateUrl: './new-pet-form.component.html',
	imports: [IonItem, IonInput, IonCard, SelectFromListComponent, IonLabel],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewPetFormComponent extends NewContactBaseFormComponent {
	protected readonly petKinds: readonly ISelectItem[] = [
		{ id: 'amphibian', title: 'Amphibian', emoji: '🐸' },
		{ id: 'bird', title: 'Bird', emoji: '🐦‍⬛' },
		{ id: 'cat', title: 'Cat', emoji: '🐱' },
		{ id: 'dog', title: 'Dog', emoji: '🐶' },
		{ id: 'fish', title: 'Fish', emoji: '🐠' },
		{ id: 'reptile', title: 'Reptile', emoji: '🐍' },
		{ id: 'rodent', title: 'Rodent', emoji: '🐹' },
		{ id: 'other', title: 'Other' },
	];

	protected breeds: readonly ISelectItem[] = [
		{ id: 'bulldog', title: 'Bulldog' },
		{ id: 'beagle', title: 'Beagle' },
		{ id: 'poodle', title: 'Poodle' },
		{ id: 'golden-retriever', title: 'Golden Retriever' },
		{ id: 'other', title: 'Other' },
	];

	public constructor() {
		super('NewPetFormComponent');
	}

	protected onPetKindChanged(petKind: string): void {
		const contact = this.$contact();
		this.contactChange.emit({
			...(contact || { id: '', space: this.$space() }),
			dbo: {
				...(contact?.dbo || { type: ContactTypeAnimal }),
				petKind: petKind as PetKind,
			},
		});
	}
}
