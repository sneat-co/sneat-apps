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
import { IContactBrief } from '@sneat/contactus-core';
import { ContactusSpaceService } from '@sneat/contactus-services';
import { IIdAndBrief, IIdAndOptionalBrief } from '@sneat/core';
import { getRelatedItems } from '@sneat/dto';
import { ISlotUIContext } from '@sneat/mod-schedulus-core';
import { SneatBaseComponent } from '@sneat/ui';

@Component({
	selector: 'sneat-happening-slot-participants',
	templateUrl: 'happening-slot-participants.component.html',
	imports: [CommonModule, IonicModule, PersonNamesPipe],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HappeningSlotParticipantsComponent extends SneatBaseComponent {
	protected contacts?: readonly IIdAndBrief<IContactBrief>[];
	protected readonly $spaceContacts = signal<
		IIdAndBrief<IContactBrief>[] | undefined
	>(undefined);

	public readonly $happeningSlot = input.required<ISlotUIContext>();

	protected readonly $relatedItems = computed(() => {
		const happeningSlot = this.$happeningSlot();
		return getRelatedItems(
			'contactus',
			'contacts',
			happeningSlot.happening.brief?.related,
		);
	});

	protected $contacts = computed(() => {
		const spaceID = this.$happeningSlot().happening?.space?.id;
		if (!spaceID) {
			return;
		}
		const happeningSlot = this.$happeningSlot();
		console.log(
			`HappeningSlotParticipantsComponent.$contacts(): spaceID=${spaceID}, wd=${happeningSlot.wd}, slotID=${happeningSlot.slot.id}`,
			spaceID,
		);
		const relatedItems = this.$relatedItems();
		const spaceContacts = this.$spaceContacts();
		const contacts = relatedItems.map((relatedItem) => {
			const keys = relatedItem.keys.filter((k) => k.spaceID == spaceID);
			return spaceContacts?.find((tc) => keys.some((k) => k.itemID === tc.id));
		});
		return (
			(contacts.filter((c) => !!c?.brief) as IIdAndBrief<IContactBrief>[]) || []
		);
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
		const effectRef = effect(() => {
			const spaceID = this.$spaceID();
			this.onSpaceIDChanged(spaceID);
		});
		this.destroyed$.subscribe(() => {
			effectRef.destroy();
		});
	}

	protected isUniqueFirstName(contact: IIdAndBrief<IContactBrief>): boolean {
		const firstName = contact.brief?.names?.firstName;
		if (!firstName) {
			return false;
		}
		return !!this.$contacts()?.some(
			(c) => c.brief?.names?.firstName === firstName,
		);
	}

	private onSpaceIDChanged(spaceID: string): void {
		// console.log('HappeningSlotParticipantsComponent.onSpaceIDChanged()', teamID);
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
					this.$spaceContacts.set(contacts);
				},
			});
	}
}
