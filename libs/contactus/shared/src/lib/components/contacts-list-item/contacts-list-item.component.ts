import { TitleCasePipe } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	EventEmitter,
	input,
	Input,
	Output,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {
	CountryFlagPipe,
	CountryTitle,
	GenderColorPipe,
	GenderIconNamePipe,
	PersonTitle,
} from '@sneat/components';
import {
	ContactRole,
	IContactWithBrief,
	IContactWithCheck,
} from '@sneat/contactus-core';
import { ContactService } from '@sneat/contactus-services';
import { IRelatedTo } from '@sneat/dto';
import { ISpaceContext } from '@sneat/space-models';
import { SpaceNavService } from '@sneat/space-services';
import { SneatBaseComponent } from '@sneat/ui';
import { ICheckChangedArgs } from '../contacts-checklist';
import { RelatedAsComponent } from './related-as.component';

@Component({
	selector: 'sneat-contacts-list-item',
	templateUrl: './contacts-list-item.component.html',
	styleUrls: ['./contacts-list-item.component.scss'],
	imports: [
		IonicModule,
		CountryTitle,
		CountryFlagPipe,
		GenderIconNamePipe,
		PersonTitle,
		TitleCasePipe,
		GenderColorPipe,
		RelatedAsComponent,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsListItemComponent extends SneatBaseComponent {
	public readonly $contact = input.required<IContactWithCheck>();
	public readonly $contactID = computed(() => this.$contact().id);
	public readonly $space = input.required<ISpaceContext>();

	@Input() hideCheckbox = false;
	@Input() excludeRole?: ContactRole;
	@Input() showAddress = false;
	@Input() showBorder: undefined | 'full' | 'inset' | 'none' = undefined;
	@Input() hideRoles: string[] = [
		'--',
		'creator',
		'contributor',
		'owner',
		'space_member',
	];

	// The `relatedTo` input is not used at the moment
	// as in related contacts we set showRelatedAs=false
	// as we are already grouping by related.
	// TODO: We need to use this in the `/space/contacts` page to show relationship to the current user.
	@Input() relatedTo?: IRelatedTo;
	@Input() showRelatedAs = true;

	@Input() showRelatedItems?: boolean;
	// protected get relatedContacts(): readonly IIdAndBrief<IRelatedItem>[] {
	// 	return []; // zipMapBriefsWithIDs(this.contact?.dto?.related);
	// }

	@Output() public readonly checkChange = new EventEmitter<ICheckChangedArgs>();

	protected checkboxChanged(event: CustomEvent): void {
		event.stopPropagation();
		event.preventDefault();
		const args: ICheckChangedArgs = {
			event,
			id: this.$contact().id,
			checked: !!event.detail.checked,
			resolve: () => void 0,
			reject: () => void 0,
		};
		this.checkChange.emit(args);
	}

	hideRole(role: string): boolean {
		return this.hideRoles.includes(role) || role == this.excludeRole;
	}

	constructor(
		private readonly spaceNavService: SpaceNavService,
		private readonly contactService: ContactService,
	) {
		super('ContactsListItemComponent');
	}

	// @Input() clicked: (contactID: string, event: Event) => void = () => void 0;

	@Input() contactClicked = (
		event: Event,
		contact: IContactWithBrief,
	): void => {
		this.console.log(
			`ContactsListItemComponent.contactClicked(contact{id=${contact.id})`,
		);
		event.stopPropagation();
		event.preventDefault();
		this.spaceNavService
			.navigateForwardToSpacePage(this.$space(), `contact/${contact.id}`, {
				state: { contact },
			})
			.catch(
				this.errorLogger.logErrorHandler('failed to navigate to contact page'),
			);
	};

	archiveContact(): void {
		console.log('ContactListItemComponent.removeContact()');
		const space = this.$space();
		if (!space.id) {
			return;
		}
		const contact = this.$contact();
		if (contact?.id) {
			this.contactService
				.setContactsStatus({
					status: 'archived',
					spaceID: space.id,
					contactIDs: [contact.id],
				})
				.subscribe({
					next: () => {
						console.log('ContactListItemComponent.removeContact() => done');
					},
					error: this.errorLogger.logError,
				});
		}
	}
}
