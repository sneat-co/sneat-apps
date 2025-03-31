import { TitleCasePipe } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Inject,
	input,
	Input,
	Output,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import {
	CountryFlagPipe,
	CountryTitle,
	GenderIconNamePipe,
	PersonTitle,
} from '@sneat/components';
import { IIdAndBrief } from '@sneat/core';
import {
	ContactRole,
	IContactBrief,
	IContactWithBrief,
	IContactWithCheck,
} from '@sneat/contactus-core';
import { IRelatedItem, IRelationshipRoles } from '@sneat/dto';
import { ContactService } from '@sneat/contactus-services';
import { ISpaceContext } from '@sneat/space-models';
import { SpaceNavService } from '@sneat/space-services';
import { SneatBaseComponent } from '@sneat/ui';
import { ICheckChangedArgs } from '../contacts-checklist';

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
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsListItemComponent extends SneatBaseComponent {
	public readonly $contact = input.required<IContactWithCheck>();
	public readonly $space = input.required<ISpaceContext>();

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

	protected get relatedContacts(): readonly IIdAndBrief<IRelatedItem>[] {
		return []; // zipMapBriefsWithIDs(this.contact?.dto?.related);
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

	@Input() goContact = (contact?: IContactWithBrief): void => {
		if (!contact) {
			this.errorLogger.logError('no contact');
			return;
		}
		this.spaceNavService
			.navigateForwardToSpacePage(this.$space(), `contact/${contact.id}`, {
				state: { contact },
			})
			.catch(
				this.errorLogger.logErrorHandler('failed to navigate to contact page'),
			);
	};

	@Input() goMember: (memberId: string, event: Event) => void = () => void 0;

	protected firstRelated(contactRelationships?: IRelationshipRoles): string {
		if (!contactRelationships) {
			return '';
		}
		const keys = Object.keys(contactRelationships);
		return keys.length ? keys[0] : '';
	}

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
