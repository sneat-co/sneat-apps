import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	signal,
	SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	IonButton,
	IonButtons,
	IonCheckbox,
	IonIcon,
	IonItem,
	IonItemDivider,
	IonLabel,
	IonSelect,
	IonSelectOption,
} from '@ionic/angular/standalone';
import { ContactTitlePipe } from '@sneat/components';
import {
	addSpace,
	ContactType,
	IContactusSpaceDbo,
	IContactWithBriefAndSpace,
} from '@sneat/contactus-core';
import {
	ContactusSpaceContextService,
	ContactusSpaceService,
} from '@sneat/contactus-services';
import { ContactusModuleBaseComponent } from '@sneat/contactus-shared';
import { IIdAndOptionalDbo } from '@sneat/core';
import { zipMapBriefsWithIDs } from '@sneat/space-models';

@Component({
	selector: 'sneat-contacts-filter',
	templateUrl: 'contacts-filter.component.html',
	imports: [
		FormsModule,
		ContactTitlePipe,
		IonItemDivider,
		IonLabel,
		IonButtons,
		IonButton,
		IonIcon,
		IonItem,
		IonCheckbox,
		IonSelect,
		IonSelectOption,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsFilterComponent
	extends ContactusModuleBaseComponent
	implements OnChanges
{
	@Output() readonly contactIDsChange = new EventEmitter<readonly string[]>();

	@Input({ required: true }) contactIDs: readonly string[] = [];

	contactID = '';
	protected readonly $selectedContacts = signal<
		readonly IContactWithBriefAndSpace[]
	>([]);

	protected readonly $contacts = signal<
		readonly IContactWithBriefAndSpace[] | undefined
	>(undefined);

	constructor(contactusSpaceService: ContactusSpaceService) {
		super('ContactsFilterComponent', contactusSpaceService);
		const contactusSpaceContextService = new ContactusSpaceContextService(
			this.destroyed$,
			this.spaceIDChanged$,
		);
		contactusSpaceContextService.contactusSpaceContext$
			.pipe(this.takeUntilDestroyed())
			.subscribe({
				next: this.onContactusSpaceChanged,
			});
	}

	private onContactusSpaceChanged(
		contactusTeam?: IIdAndOptionalDbo<IContactusSpaceDbo>,
	): void {
		const contactBriefs = zipMapBriefsWithIDs(
			contactusTeam?.dbo?.contacts,
		)?.map((m) => ({
			...m,
			space: this.space || { id: '' },
		}));
		this.$contacts.set(
			contactBriefs.filter((c) => c.brief.roles?.includes('member')),
		);
	}

	ngOnChanges(changes: SimpleChanges): void {
		console.log('ContactsFilterComponent.ngOnChanges()', changes);
		if (changes['contactIDs']) {
			this.setSelectedMembers();
		}
	}

	protected clearMembers(): void {
		this.contactIDs = [];
		this.contactIDsChange.emit(this.contactIDs);
	}

	protected onContactCheckChanged(event: Event): void {
		console.log('ContactsFilterComponent.onContactCheckChanged()', event);
		event.stopPropagation();
		const cs = event as CustomEvent;
		const { checked, value } = cs.detail;
		if (checked === undefined) {
			// a dropdown
			this.contactIDs = this.contactID ? [this.contactID] : [];
		} else if (checked === true) {
			this.contactIDs = [...this.contactIDs, value];
		} else if (checked === false) {
			this.contactIDs = this.contactIDs.filter((id) => id !== value);
		}
		this.setSelectedMembers();
		this.contactIDsChange.emit(this.contactIDs);
	}

	private setSelectedMembers(): void {
		const space = this.$space();
		const contacts = this.$contacts() || [];
		const selectedContacts = this.contactIDs.map((id) => {
			let contact = contacts.find((m) => m.id == id);
			if (!contact) {
				contact = {
					id,
					brief: { type: 'not_found' as ContactType },
					space: space,
				};
			}
			return contact;
		});
		this.$selectedContacts.set(selectedContacts.map(addSpace(space)));
		// this.selectedContacts;
	}
}
