import { Component, computed, input } from '@angular/core';
import { IonCard, IonItem, IonLabel } from '@ionic/angular/standalone';
import { IRelatedItem, IRelatedItemsByModule } from '@sneat/dto';
import { WithSpaceInput } from '@sneat/space-components';
import { RelatedContactComponent } from './related-contact.component';

@Component({
	selector: 'sneat-related-contacts',
	templateUrl: './related-contacts.component.html',
	imports: [IonCard, IonItem, IonLabel, RelatedContactComponent],
})
export class RelatedContactsComponent extends WithSpaceInput {
	public readonly $related = input.required<
		IRelatedItemsByModule | undefined
	>();

	protected readonly $relatedContacts = computed<
		readonly IRelatedItem[] | undefined
	>(() => {
		const related = this.$related() || {};
		const contactus = related['contactus'];
		return (contactus && contactus['contacts']) || [];
	});

	constructor() {
		super('RelatedContactsComponent');
	}
}
