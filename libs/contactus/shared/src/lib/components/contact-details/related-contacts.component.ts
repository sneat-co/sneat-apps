import { LowerCasePipe } from '@angular/common';
import { Component, computed, effect, input, signal } from '@angular/core';
import {
	IonButton,
	IonButtons,
	IonCard,
	IonIcon,
	IonItem,
	IonItemDivider,
	IonItemSliding,
	IonLabel,
	IonSpinner,
} from '@ionic/angular/standalone';
import { addSpace, IContactWithCheck } from '@sneat/contactus-core';
import { ContactusSpaceService } from '@sneat/contactus-services';
import { listItemAnimations } from '@sneat/core';
import { ContactsListItemComponent } from '../contacts-list-item/contacts-list-item.component';
import {
	getRelatedItems,
	IRelatedItem,
	IRelatedItemsByModule,
	IRelatedTo,
} from '@sneat/dto';
import { WithSpaceInput } from '@sneat/space-components';
import { Subscription } from 'rxjs';

interface IRelatedGroup {
	readonly title: string;
	readonly maxCount?: number;
	readonly relatedAs: string;
	readonly contacts?: readonly IContactWithCheck[];
}

const emptyRelatedGroups: readonly IRelatedGroup[] = [
	{
		title: 'Parents',
		relatedAs: 'parent',
	},
	{
		title: 'Children',
		relatedAs: 'child',
	},
	{
		title: 'Siblings',
		relatedAs: 'sibling',
	},
	{
		title: 'Friends',
		relatedAs: 'friend',
	},
	{
		title: 'Other',
		relatedAs: 'other',
		maxCount: 1,
	},
];

const emptyRelatedGroupRoles = emptyRelatedGroups
	.map((g) => g.relatedAs)
	.filter((id) => id !== 'other');

@Component({
	selector: 'sneat-related-contacts',
	templateUrl: './related-contacts.component.html',
	animations: [listItemAnimations],
	imports: [
		IonCard,
		IonItem,
		IonLabel,
		ContactsListItemComponent,
		IonItemSliding,
		IonButtons,
		IonButton,
		IonIcon,
		IonItemDivider,
		LowerCasePipe,
		IonSpinner,
	],
})
export class RelatedContactsComponent extends WithSpaceInput {
	public readonly $relatedTo = input.required<IRelatedTo | undefined>();

	public readonly $related = computed<IRelatedItemsByModule | undefined>(
		() => this.$relatedTo()?.related,
	);

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

	protected $relatedGroups = computed<readonly IRelatedGroup[]>(() => {
		const relatedContacts = this.$relatedContacts();
		const related = this.$related();
		if (!related || !relatedContacts) {
			return emptyRelatedGroups;
		}
		const relatedItems = getRelatedItems('contactus', 'contacts', related);

		return emptyRelatedGroups.map((g) => ({
			...g,
			contacts:
				relatedContacts?.filter((c) =>
					relatedItems.some(
						(ri) =>
							ri.keys.some(
								(k) => k.itemID === c.id && k.spaceID === c.space.id,
							) &&
							ri.rolesToItem &&
							(g.relatedAs === 'other'
								? !emptyRelatedGroupRoles.some(
										(r) => ri.rolesToItem && ri.rolesToItem[r],
									)
								: ri.rolesToItem[g.relatedAs]),
					),
				) || [],
		}));
	});

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
