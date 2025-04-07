import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	input,
	signal,
	computed,
	effect,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PersonNamesPipe } from '@sneat/components';
import {
	ContactType,
	IContactWithBrief,
	IContactWithBriefAndSpace,
} from '@sneat/contactus-core';
import { ContactusSpaceService } from '@sneat/contactus-services';
import { getRelatedItems } from '@sneat/dto';
import { ISlotUIContext } from '@sneat/mod-schedulus-core';
import { ISpaceRef } from '@sneat/core';
import { SneatBaseComponent } from '@sneat/ui';

@Component({
	selector: 'sneat-happening-slot-participants',
	templateUrl: 'happening-slot-participants.component.html',
	imports: [CommonModule, IonicModule, PersonNamesPipe],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HappeningSlotParticipantsComponent extends SneatBaseComponent {
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
		const contacts: readonly IContactWithBriefAndSpace[] = relatedItems.map(
			(relatedItem): IContactWithBriefAndSpace => {
				const keys = relatedItem.keys.filter(
					(k) => !k.spaceID || k.spaceID == spaceID,
				);
				let contact = spaceContacts?.find((tc) =>
					keys.some((k) => k.itemID === tc.id),
				);
				if (!contact) {
					contact = {
						id: keys[0].itemID,
						brief: { type: undefined as unknown as ContactType },
					};
				}
				return { ...contact, space };
			},
		);
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

	constructor(
		private readonly changedDetectorRef: ChangeDetectorRef,
		private readonly contactusService: ContactusSpaceService,
	) {
		super('HappeningSlotParticipantsComponent');
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
