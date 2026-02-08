import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	input,
	signal,
	computed,
	effect,
	inject,
} from '@angular/core';
import { IonBadge, IonLabel } from '@ionic/angular/standalone';
import { PersonNamesPipe } from '@sneat/auth-ui';
import {
	IContactWithBrief,
	IContactWithBriefAndSpace,
} from '@sneat/contactus-core';
import { ContactusSpaceService } from '@sneat/contactus-services';
import { getRelatedItemByIDs, getRelatedItems } from '@sneat/dto';
import { ISlotUIContext } from '@sneat/mod-schedulus-core';
import { ISpaceRef } from '@sneat/core';
import { ClassName, SneatBaseComponent } from '@sneat/ui';

@Component({
	imports: [PersonNamesPipe, IonBadge, IonLabel],
	providers: [
		{ provide: ClassName, useValue: 'HappeningSlotParticipantsComponent' },
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'sneat-happening-slot-participants',
	templateUrl: 'happening-slot-participants.component.html',
})
export class HappeningSlotParticipantsComponent extends SneatBaseComponent {
	private readonly changedDetectorRef = inject(ChangeDetectorRef);
	private readonly contactusService = inject(ContactusSpaceService);

	protected contacts?: readonly IContactWithBriefAndSpace[];
	protected readonly $spaceContacts = signal<
		readonly IContactWithBrief[] | undefined
	>(undefined);

	public readonly $happeningSlot = input.required<ISlotUIContext>();

	protected readonly $relatedItems = computed(() => {
		const happeningSlot = this.$happeningSlot();
		console.log('happeningSlot:', happeningSlot);
		return getRelatedItems(
			'contactus',
			'contacts',
			happeningSlot.happening.brief?.related,
		);
	});

	protected $contacts = computed(() => {
		const spaceID = this.$happeningSlot().happening?.space?.id || '';
		if (!spaceID) {
			return;
		}
		const happeningSlot = this.$happeningSlot();
		const relatedItems = this.$relatedItems();
		const spaceContacts = this.$spaceContacts();
		const space: ISpaceRef = { id: spaceID };
		const contacts: readonly IContactWithBriefAndSpace[] =
			spaceContacts
				?.filter((c) => !!getRelatedItemByIDs(relatedItems, c.id, spaceID))
				?.map((c) => Object.assign(c, { space })) || [];

		console.log(
			`HappeningSlotParticipantsComponent.$contacts(): spaceID=${spaceID}, wd=${happeningSlot.wd}, slotID=${happeningSlot.slot.id}`,
			'relatedItems:',
			relatedItems,
			'spaceContacts:',
			spaceContacts,
			'contacts:',
			contacts,
		);
		return contacts.filter((c) => !!c?.brief) || [];
	});

	private readonly $spaceID = computed(
		() => this.$happeningSlot().happening.space.id,
	);

	// private readonly spaceID$ = new Subject<string>();

	public constructor() {
		super();
		effect(() => {
			const spaceID = this.$spaceID();
			this.onSpaceIDChanged(spaceID);
		});
	}

	protected isUniqueFirstName(contact: IContactWithBriefAndSpace): boolean {
		const firstName = contact.brief?.names?.firstName;
		if (!firstName) {
			return false;
		}
		return !!this.$contacts()?.some(
			(c) => c.brief?.names?.firstName === firstName,
		);
	}

	private onSpaceIDChanged(spaceID: string): void {
		// console.log('HappeningSlotParticipantsComponent.onSpaceIDChanged()', spaceID);
		const space = { id: spaceID };
		this.contactusService
			.watchContactBriefs(spaceID)
			.pipe(this.takeUntilDestroyed())
			.subscribe({
				next: (contacts) => {
					// console.log(
					// 	'HappeningSlotParticipantsComponent.contacts =>',
					// 	this.happeningSlot?.slotID,
					// 	contacts,
					// );
					this.$spaceContacts.set(contacts.map((c) => ({ ...c, space })));
				},
			});
	}
}
