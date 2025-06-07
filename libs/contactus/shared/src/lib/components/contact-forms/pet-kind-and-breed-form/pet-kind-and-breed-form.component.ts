import { Component, EventEmitter, Output } from '@angular/core';
import { IonCard, IonItemDivider, IonLabel } from '@ionic/angular/standalone';
import { ClassName, ISelectItem, SelectFromListComponent } from '@sneat/ui';
import { ContactTypeAnimal, PetKind } from '@sneat/contactus-core';
import { EditContactFormBaseComponent } from '../contact-form-base.component';

@Component({
	imports: [SelectFromListComponent, IonCard, IonItemDivider, IonLabel],
	selector: 'sneat-pet-kind-and-breed-form',
	templateUrl: './pet-kind-and-breed-form.component.html',
	providers: [{ provide: ClassName, useValue: 'PetKindAndBreedFormComponent' }],
})
export class PetKindAndBreedFormComponent extends EditContactFormBaseComponent {
	@Output() readonly petKindChange = new EventEmitter<PetKind | undefined>();

	protected breeds: readonly ISelectItem[] = [
		{ id: 'bulldog', title: 'Bulldog' },
		{ id: 'beagle', title: 'Beagle' },
		{ id: 'poodle', title: 'Poodle' },
		{ id: 'golden-retriever', title: 'Golden Retriever' },
		{ id: 'other', title: 'Other' },
	];

	protected readonly petKinds: ISelectItem[] = [
		{ id: 'dog', emoji: '🐕', title: 'Dog' },
		{ id: 'cat', emoji: '🐈', title: 'Cat' },
		{ id: 'amphibian', title: 'Amphibian', emoji: '🐸' },
		{ id: 'bird', emoji: '🐦', title: 'Bird' },
		{ id: 'fish', emoji: '🐠', title: 'Fish' },
		{ id: 'rodent', title: 'Rodent', emoji: '🐹' },
		// { id: 'mouse', emoji: '🐭', title: 'Mouse' },
		// { id: 'rat', emoji: '🐁', title: 'Rat' },
		// { id: 'hamster', emoji: '🐹', title: 'Hamster' },
		{ id: 'horse', emoji: '🐴', title: 'Horse' },
		{ id: 'reptile', title: 'Reptile', emoji: '🐍' },
		{ id: 'turtle', emoji: '🐢', title: 'Turtle' },
		// { id: 'snake', emoji: '🐍', title: 'Snake' },
		// { id: 'lizard', emoji: '🦎', title: 'Lizard' },
		{ id: 'other', emoji: '🐾', title: 'Other' },
	];

	public constructor() {
		super();
	}

	protected onPetKindChanged(petKind: string): void {
		console.log('onPetKindChanged', petKind);
		const contact = this.$contact();
		this.contactChange.emit({
			...contact,
			dbo: {
				...(contact?.dbo || { type: ContactTypeAnimal }),
				petKind: petKind as PetKind,
				petBreed: petKind ? contact?.dbo?.petBreed : undefined,
			},
		});
	}

	protected onPetBreedChanged(petBreed: string): void {
		const contact = this.$contact();
		this.contactChange.emit({
			...contact,
			dbo: {
				...(contact?.dbo || { type: ContactTypeAnimal }),
				petBreed,
			},
		});
	}
}
