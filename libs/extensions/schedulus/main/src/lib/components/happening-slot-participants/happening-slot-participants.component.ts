import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	Inject,
	Input,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import { IContactBrief } from '@sneat/contactus-core';
import { ContactusTeamService } from '@sneat/contactus-services';
import { IIdAndBrief, IIdAndOptionalBrief } from '@sneat/core';
import { getRelatedItems, IRelatedItem } from '@sneat/dto';
import { IHappeningSlotUiItem } from '@sneat/extensions/schedulus/shared';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { SneatBaseComponent } from '@sneat/ui';
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'sneat-happening-slot-participants',
	templateUrl: 'happening-slot-participants.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule, SneatPipesModule],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HappeningSlotParticipantsComponent
	extends SneatBaseComponent
	implements OnChanges
{
	// @Input({ required: true }) public contactus?: IIdAndOptionalDto;
	@Input({ required: true }) public happeningSlot?: IHappeningSlotUiItem;

	protected relatedItems?: readonly IRelatedItem[];
	protected contacts?: readonly IIdAndBrief<IContactBrief>[];
	protected teamContacts?: IIdAndBrief<IContactBrief>[];

	private readonly teamID$ = new Subject<string>();

	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		private readonly changedDetectorRef: ChangeDetectorRef,
		private readonly contactusService: ContactusTeamService,
	) {
		super('HappeningSlotParticipantsComponent', errorLogger);
		this.teamID$
			.pipe(takeUntil(this.destroyed), distinctUntilChanged())
			.subscribe((teamID) => {
				this.onTeamIDChanged(teamID);
			});
	}

	public ngOnChanges(changes: SimpleChanges): void {
		// console.log(
		// 	'HappeningSlotParticipantsComponent.ngOnChanges()',
		// 	this.happeningSlot?.slotID,
		// 	changes,
		// );
		const { happeningSlot } = changes;
		if (happeningSlot) {
			const previous = happeningSlot.previousValue as IHappeningSlotUiItem;
			const current = happeningSlot.currentValue as IHappeningSlotUiItem;
			if (current?.happening?.team?.id !== previous?.happening?.team?.id) {
				this.teamID$.next(current?.happening?.team?.id);
			}
		}
		if (changes['happeningSlot']) {
			this.relatedItems = getRelatedItems(
				'contactus',
				'contacts',
				this.happeningSlot?.happening?.brief?.related,
			);
			if (this.teamContacts) {
				this.populateContacts();
			}
		}
	}

	private onTeamIDChanged(teamID: string): void {
		// console.log('HappeningSlotParticipantsComponent.onTeamIDChanged()', teamID);
		this.contactusService
			.watchContactBriefs(teamID)
			.pipe(takeUntil(this.teamID$), takeUntil(this.destroyed))
			.subscribe({
				next: (contacts) => {
					// console.log(
					// 	'HappeningSlotParticipantsComponent.contacts =>',
					// 	this.happeningSlot?.slotID,
					// 	contacts,
					// );
					this.teamContacts = contacts;
					this.populateContacts();
				},
			});
	}

	private populateContacts(): void {
		const teamID = this.happeningSlot?.happening?.team?.id;
		if (!teamID) {
			return;
		}
		// console.log(
		// 	'HappeningSlotParticipantsComponent.populateContacts()',
		// 	teamID,
		// 	this.happeningSlot?.slotID,
		// 	this.happeningSlot?.wd,
		// );
		const contacts = (this.relatedItems || []).map((relatedItem) => {
			const key = relatedItem.keys.find((k) => k.teamID == teamID);
			const id = key?.itemID;
			const contact: IIdAndOptionalBrief<IContactBrief> =
				this.teamContacts?.find((tc) => tc.id === id) || {
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
