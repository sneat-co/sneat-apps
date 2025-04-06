import {
	Component,
	computed,
	EventEmitter,
	Inject,
	input,
	Output,
	signal,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { ContactTitlePipe, ContactsAsBadgesComponent } from '@sneat/components';
import {
	addSpace,
	IContactusSpaceDboAndID,
	IContactWithBrief,
	IContactWithSpace,
} from '@sneat/contactus-core';
import { ContactsListComponent } from '../contacts-list';
import { IContactSelectorOptions } from './contacts-selector.interfaces';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/space-models';
import { ContactsSelectorService } from './contacts-selector.service';

@Component({
	selector: 'sneat-contacts-selector-input',
	templateUrl: 'contacts-selector-input.component.html',
	imports: [
		IonicModule,
		ContactsListComponent,
		ContactTitlePipe,
		ContactsAsBadgesComponent,
	],
})
export class ContactsSelectorInputComponent {
	// TODO: Is it duplicate of ContactInputComponent?
	protected readonly $contactusSpace = signal<
		IContactusSpaceDboAndID | undefined
	>(undefined);

	public readonly $space = input.required<ISpaceContext>();
	public readonly $contacts = input.required<
		readonly IContactWithBrief[] | undefined
	>();
	protected readonly $contactsWithSpace = computed(() => {
		const space = this.$space();
		return this.$contacts()?.map(addSpace(space));
	});
	public readonly $selectedContacts =
		input.required<readonly IContactWithSpace[]>();

	public readonly $hasSelectedContacts = computed(
		() => !!this.$selectedContacts().length,
	);

	public readonly $max = input<number | undefined>(undefined);

	@Output() readonly selectedContactsChange = new EventEmitter<
		readonly IContactWithSpace[]
	>();

	@Output() readonly removeMember = new EventEmitter<IContactWithBrief>();

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly contactsSelectorService: ContactsSelectorService,
	) {}

	get selectedContactID(): string | undefined {
		const selectedContacts = this.$selectedContacts();
		return (selectedContacts.length && selectedContacts[0].id) || undefined;
	}

	protected selectContacts(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		const space = this.$space();
		const contactusSpace = this.$contactusSpace();
		if (!contactusSpace || !space) {
			return;
		}
		const options: IContactSelectorOptions = {
			selectedItems: this.$selectedContacts(),
			// items: from(
			// 	zipMapBriefsWithIDs(contactusSpace.dbo?.contacts)?.map((m) =>
			// 		contactContextFromBrief(m, space),
			// 	),
			// ),
			max: this.$max(),
		};
		this.contactsSelectorService
			.selectMultipleContacts(options)
			.then((selectedContacts) => {
				// this.$selectedContacts.set( selectedContacts || []);
				this.selectedContactsChange.emit(selectedContacts || []);
			})
			.catch(
				this.errorLogger.logErrorHandler('Failed to select members in modal'),
			);
	}

	onRemoveMember(member: IContactWithBrief): void {
		this.removeMember.emit(member);
	}

	onSelectedMembersChanged(members: readonly IContactWithSpace[]): void {
		console.log('onSelectedMembersChanged()', members);
		this.selectedContactsChange.emit(members);
	}

	clear(): void {
		// this.selectedContacts = [];
		this.selectedContactsChange.emit([]);
	}
}
