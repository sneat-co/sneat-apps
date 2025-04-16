import { Component, computed, input } from '@angular/core';
import { IonIcon, IonItem, IonLabel } from '@ionic/angular/standalone';
import { GenderIconNamePipe } from '@sneat/components';
import { IContactBrief, IContactWithBrief } from '@sneat/contactus-core';
import { IRelatedItem } from '@sneat/dto';

@Component({
	selector: 'sneat-related-contact',
	templateUrl: './related-contact.component.html',
	imports: [GenderIconNamePipe, IonItem, IonIcon, IonLabel],
})
export class RelatedContactComponent {
	readonly $relatedItem = input.required<IRelatedItem | undefined>();

	readonly $spaceContacts = input.required<
		readonly IContactWithBrief[] | undefined
	>();

	protected readonly $contactBrief = computed<IContactBrief | undefined>(() => {
		const relatedItem = this.$relatedItem();
		const relatedItemID = relatedItem?.keys[0]?.itemID;
		if (relatedItemID) {
			return this.$spaceContacts()?.find((c) => c.id === relatedItemID)?.brief;
		}
		return undefined;
	});

	protected goContact(): void {
		console.log('goContact', this.$relatedItem());
	}
}
