import { LowerCasePipe } from '@angular/common';
import {
	Component,
	computed,
	effect,
	input,
	signal,
	inject,
} from '@angular/core';
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
	IRelatedItems,
	IRelatedModules,
	IRelatedTo,
} from '@sneat/dto';
import { WithSpaceInput } from '@sneat/space-services';
import { Subscription } from 'rxjs';
import { ClassName } from '@sneat/ui';

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
	providers: [{ provide: ClassName, useValue: 'RelatedContactsComponent' }],
})
export class RelatedContactsComponent extends WithSpaceInput {
	private readonly contactusSpaceService = inject(ContactusSpaceService);

	public readonly $relatedTo = input.required<IRelatedTo | undefined>();

	public readonly $related = computed<IRelatedModules | undefined>(
		() => this.$relatedTo()?.related,
	);

	protected readonly $spaceContacts = signal<
		readonly IContactWithCheck[] | undefined
	>(undefined);

	protected readonly $relatedItems = computed<IRelatedItems | undefined>(() => {
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
		return spaceContacts?.filter((c) => relatedItems[c.id]);
	});

	private subscription?: Subscription;

	protected $relatedGroups = computed<readonly IRelatedGroup[]>(() => {
		const relatedContacts = this.$relatedContacts();
		const related = this.$related();
		if (!related || !relatedContacts) {
			return emptyRelatedGroups;
		}
		const relatedItems = getRelatedItems('contactus', 'contacts', related);

		return emptyRelatedGroups.map((g) =>
			Object.assign(g, {
				contacts:
					relatedContacts?.filter((c) => {
						const ri = relatedItems[c.id];
						return (
							ri?.rolesOfItem &&
							(g.relatedAs === `other`
								? !emptyRelatedGroupRoles.some(
										(r) => ri.rolesOfItem && ri.rolesOfItem[r],
									)
								: ri.rolesOfItem[g.relatedAs])
						);
					}) || [],
			}),
		);
	});

	constructor() {
		super();
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
