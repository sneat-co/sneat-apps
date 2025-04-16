import { Component, computed, effect, input, signal } from '@angular/core';
import {
	IonCard,
	IonItem,
	IonItemSliding,
	IonLabel,
	IonList,
} from '@ionic/angular/standalone';
import { addSpace, IContactWithCheck } from '@sneat/contactus-core';
import { ContactusSpaceService } from '@sneat/contactus-services';
import { ContactsListItemComponent } from '../contacts-list-item/contacts-list-item.component';
import { ContactsComponent } from '../contacts-component/contacts.component';
import { IRelatedItem, IRelatedItemsByModule } from '@sneat/dto';
import { WithSpaceInput } from '@sneat/space-components';
import { Subscription } from 'rxjs';
import { RelatedContactComponent } from './related-contact.component';

@Component({
	selector: 'sneat-related-contacts',
	templateUrl: './related-contacts.component.html',
	imports: [
		IonCard,
		IonItem,
		IonLabel,
		ContactsListItemComponent,
		IonItemSliding,
	],
})
export class RelatedContactsComponent extends WithSpaceInput {
	public readonly $related = input.required<
		IRelatedItemsByModule | undefined
	>();

	protected readonly $spaceContacts = signal<
		readonly IContactWithCheck[] | undefined
	>(undefined);

	protected readonly $relatedItems = computed<
		readonly IRelatedItem[] | undefined
	>(() => {
		const related = this.$related() || {};
		const contactus = related['contactus'];
		return (contactus && contactus['contacts']) || [];
	});

	protected readonly $relatedContacts = computed<
		readonly IContactWithCheck[] | undefined
	>(() => {
		const relatedItems = this.$relatedItems();
		if (!relatedItems) {
			return undefined;
		}
		const spaceContacts = this.$spaceContacts();
		if (!spaceContacts) {
			return undefined;
		}
		return relatedItems
			.map((relatedItem) => {
				const relatedItemID = relatedItem.keys[0].itemID;
				return spaceContacts.find((c) => c.id === relatedItemID);
			})
			.filter((c) => !!c);
	});

	private subscription?: Subscription;

	constructor(private readonly contactusSpaceService: ContactusSpaceService) {
		super('RelatedContactsComponent');
		let prevSpaceID: string;
		effect(() => {
			const spaceID = this.$spaceID();
			if (spaceID !== prevSpaceID) {
				this.subscription?.unsubscribe();
				prevSpaceID = spaceID;
			}
			if (!spaceID) {
				return;
			}
			this.subscription = this.contactusSpaceService
				.watchContactBriefs(spaceID)
				.pipe(this.takeUntilDestroyed())
				.subscribe((briefs) => {
					const space = this.$space();
					if (space.id !== spaceID) {
						throw new Error('space.id !== spaceID');
					}
					this.$spaceContacts.set(briefs.map(addSpace(space)) || []);
				});
		});
	}
}
