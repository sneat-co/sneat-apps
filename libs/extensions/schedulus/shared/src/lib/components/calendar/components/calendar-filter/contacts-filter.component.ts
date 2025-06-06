import {
	ChangeDetectionStrategy,
	Component,
	computed,
	EventEmitter,
	input,
	Output,
	signal,
	inject,
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
	IonSegment,
	IonSegmentButton,
	IonSelect,
	IonSelectOption,
} from '@ionic/angular/standalone';
import { ContactTitlePipe } from '@sneat/contactus-shared';
import {
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
		IonSegment,
		IonSegmentButton,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsFilterComponent extends ContactusModuleBaseComponent {
	public readonly $contactIDs = input.required<readonly string[]>();

	protected readonly $hasContactIDs = computed(
		() => !!this.$contactIDs().length,
	);

	contactIDs: readonly string[] = [];
	@Output() readonly contactIDsChange = new EventEmitter<readonly string[]>();

	protected readonly $tab = signal<'members' | 'contacts'>('members');

	protected onTabChanged(event: CustomEvent): void {
		this.$tab.set(event.detail.value);
	}

	contactID = ''; // TODO: Needs documentation on what & why

	// protected readonly $selectedContacts = computed<
	// 	readonly IContactWithBriefAndSpace[]
	// >(() => {
	// 	const space = this.$space();
	// 	const contacts = this.$members() || [];
	// 	const selectedContacts = this.contactIDs.map((id) => {
	// 		let contact = contacts.find((m) => m.id == id);
	// 		if (!contact) {
	// 			contact = {
	// 				id,
	// 				brief: { type: 'not_found' as ContactType },
	// 				space: space,
	// 			};
	// 		}
	// 		return contact;
	// 	});
	// 	return selectedContacts.map(addSpace(space));
	// });

	protected readonly $members = signal<
		readonly IContactWithBriefAndSpace[] | undefined
	>(undefined);

	constructor() {
		const contactusSpaceService = inject(ContactusSpaceService);

		super('ContactsFilterComponent', contactusSpaceService);
		const contactusSpaceContextService = new ContactusSpaceContextService(
			this.destroyed$,
			this.spaceIDChanged$,
		);
		contactusSpaceContextService.contactusSpaceContext$
			.pipe(this.takeUntilDestroyed())
			.subscribe(this.onContactusSpaceChanged.bind(this));
	}

	private onContactusSpaceChanged(
		contactusSpace?: IIdAndOptionalDbo<IContactusSpaceDbo>,
	): void {
		console.log(
			'ContactsFilterComponent.onContactusSpaceChanged()',
			contactusSpace,
		);
		const contactBriefs = zipMapBriefsWithIDs(
			contactusSpace?.dbo?.contacts,
		)?.map((m) => ({
			...m,
			space: this.space || { id: '' },
		}));
		this.$members.set(
			contactBriefs.filter((c) => c.brief.roles?.includes('member')),
		);
	}

	protected clearSelectedContacts(): void {
		this.contactIDsChange.emit([]);
	}

	protected onContactCheckChanged(event: Event): void {
		console.log('ContactsFilterComponent.onContactCheckChanged()', event);
		event.stopPropagation();
		const cs = event as CustomEvent;
		const { checked, value } = cs.detail;
		let contactIDs = this.$contactIDs();
		if (checked === undefined) {
			// a dropdown
			contactIDs = this.contactID ? [this.contactID] : [];
		} else if (checked === true) {
			contactIDs = [...contactIDs, value];
		} else if (checked === false) {
			contactIDs = contactIDs.filter((id) => id !== value);
		}
		this.contactIDsChange.emit(contactIDs);
	}
}
