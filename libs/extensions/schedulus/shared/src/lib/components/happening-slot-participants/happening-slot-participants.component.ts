import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Input,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { PersonNamesPipe } from '@sneat/components';
import { IContactBrief } from '@sneat/contactus-core';
import { ContactusSpaceService } from '@sneat/contactus-services';
import { IIdAndBrief, IIdAndOptionalBrief } from '@sneat/core';
import { getRelatedItems, IRelatedItem } from '@sneat/dto';
import { ISlotUIContext } from '@sneat/mod-schedulus-core';
import { SneatBaseComponent } from '@sneat/ui';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'sneat-happening-slot-participants',
	templateUrl: 'happening-slot-participants.component.html',
	imports: [CommonModule, IonicModule, PersonNamesPipe],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HappeningSlotParticipantsComponent
	extends SneatBaseComponent
	implements OnChanges
{
	// @Input({ required: true }) public contactus?: IIdAndOptionalDto;
	@Input({ required: true }) public happeningSlot?: ISlotUIContext;

	protected relatedItems?: readonly IRelatedItem[];
	protected contacts?: readonly IIdAndBrief<IContactBrief>[];
	protected spaceContacts?: IIdAndBrief<IContactBrief>[];

	private readonly spaceID$ = new Subject<string>();

	constructor(
		private readonly changedDetectorRef: ChangeDetectorRef,
		private readonly contactusService: ContactusSpaceService,
	) {
		super('HappeningSlotParticipantsComponent');
		this.spaceID$
			.pipe(takeUntil(this.destroyed$), distinctUntilChanged())
			.subscribe((teamID) => {
				this.onSpaceIDChanged(teamID);
			});
	}

	protected isUniqueFirstName(contact: IIdAndBrief<IContactBrief>): boolean {
		const firstName = contact.brief?.names?.firstName;
		if (!firstName) {
			return false;
		}
		return !!this.contacts?.some(
			(c) => c.brief?.names?.firstName === firstName,
		);
	}

	public ngOnChanges(changes: SimpleChanges): void {
		// console.log(
		// 	'HappeningSlotParticipantsComponent.ngOnChanges()',
		// 	this.happeningSlot?.slotID,
		// 	changes,
		// );
		const { happeningSlot } = changes;
		if (happeningSlot) {
			const previous = happeningSlot.previousValue as ISlotUIContext;
			const current = happeningSlot.currentValue as ISlotUIContext;
			if (current?.happening?.space?.id !== previous?.happening?.space?.id) {
				this.spaceID$.next(current?.happening?.space?.id);
			}
		}
		if (changes['happeningSlot']) {
			this.relatedItems = getRelatedItems(
				'contactus',
				'contacts',
				this.happeningSlot?.happening?.brief?.related,
			);
			if (this.spaceContacts) {
				this.populateContacts();
			}
		}
	}

	private onSpaceIDChanged(spaceID: string): void {
		// console.log('HappeningSlotParticipantsComponent.onTeamIDChanged()', teamID);
		this.contactusService
			.watchContactBriefs(spaceID)
			.pipe(takeUntil(this.spaceID$), takeUntil(this.destroyed$))
			.subscribe({
				next: (contacts) => {
					// console.log(
					// 	'HappeningSlotParticipantsComponent.contacts =>',
					// 	this.happeningSlot?.slotID,
					// 	contacts,
					// );
					this.spaceContacts = contacts;
					this.populateContacts();
				},
			});
	}

	private populateContacts(): void {
		const spaceID = this.happeningSlot?.happening?.space?.id;
		if (!spaceID) {
			return;
		}
		// console.log(
		// 	'HappeningSlotParticipantsComponent.populateContacts()',
		// 	teamID,
		// 	this.happeningSlot?.slotID,
		// 	this.happeningSlot?.wd,
		// );
		const contacts = (this.relatedItems || []).map((relatedItem) => {
			const key = relatedItem.keys.find((k) => k.spaceID == spaceID);
			const id = key?.itemID;
			const contact: IIdAndOptionalBrief<IContactBrief> =
				this.spaceContacts?.find((tc) => tc.id === id) || {
					id: relatedItem.keys[0].itemID,
					brief: undefined,
				};
			return contact;
		});
		this.contacts = contacts.filter(
			(c) => !!c.brief,
		) as IIdAndBrief<IContactBrief>[];
		this.changedDetectorRef.markForCheck();
	}
}
