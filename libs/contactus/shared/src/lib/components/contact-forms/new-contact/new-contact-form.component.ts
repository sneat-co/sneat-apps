import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	Input,
	signal,
} from '@angular/core';
import { IonSegment, IonSegmentButton } from '@ionic/angular/standalone';
import {
	ContactRolePet,
	IContactContext,
	RoleSpaceMember,
} from '@sneat/contactus-core';
import { Observable } from 'rxjs';
import { IContactAddEventArgs } from '../../contact-events';
import { NewCompanyFormComponent } from './new-company-form.component';
import { NewContactFormBaseComponent } from './new-contact-form-base.component';
import {
	NewContactFormCommand,
	NewPersonFormComponent,
} from './new-person-form.component';

import { ContactTypeAnimal } from '@sneat/contactus-core';
import { NewPetFormComponent } from './new-pet-form.component';

type NewContactFormTab = 'person' | 'pet' | 'company' | 'location';

@Component({
	imports: [
		IonSegment,
		IonSegmentButton,
		NewPersonFormComponent,
		NewCompanyFormComponent,
		NewPetFormComponent,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'sneat-new-contact-form',
	templateUrl: './new-contact-form.component.html',
})
export class NewContactFormComponent extends NewContactFormBaseComponent {
	protected readonly $tab = signal<NewContactFormTab | undefined>(undefined);

	@Input() command?: Observable<NewContactFormCommand>;
	@Input() selectGroupAndRole$?: Observable<IContactAddEventArgs | undefined>;

	private readonly $contactType = computed(() => this.$contact()?.dbo?.type);

	constructor() {
		super('NewContactFormComponent');
		effect(() => {
			const contactType = this.$contactType();
			switch (contactType) {
				case 'person':
				case 'company':
				case 'location':
					this.$tab.set(contactType);
					break;
				case undefined:
					this.$tab.set('person');
			}
		});
	}

	protected onTabChange(event: CustomEvent): void {
		const tab = event.detail.value as NewContactFormTab;
		if (tab === 'pet') {
			let contact = this.$contact();
			if (!contact?.dbo) {
				contact = {
					...contact,
					dbo: {
						type: ContactTypeAnimal,
						roles: [RoleSpaceMember, ContactRolePet],
					},
				};
			} else {
				contact = {
					...contact,
					dbo: {
						...(contact.dbo || {}),
						type: ContactTypeAnimal,
						roles: [RoleSpaceMember, ContactRolePet],
					},
				};
			}
			this.contactChange.emit(contact);
		}
		this.$tab.set(tab);
	}

	protected onContactChanged(contact: IContactContext): void {
		console.log('onContactChanged', contact);
		this.contactChange.emit(contact);
	}
}
