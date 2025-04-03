import { TitleCasePipe } from '@angular/common';
import {
	Component,
	computed,
	effect,
	Inject,
	input,
	Input,
	signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { CONTACT_ROLES_BY_TYPE, ContactRolesByType } from '@sneat/app';
import { getFullName } from '@sneat/auth-models';
import { countryFlagEmoji } from '@sneat/components';
import {
	ISelectItem,
	SelectFromListComponent,
	SelectorBaseComponent,
} from '@sneat/ui';
import {
	ContactRole,
	ContactType,
	IContactContext,
	IContactWithBrief,
	IContactWithCheck,
	IContactWithSpace,
} from '@sneat/contactus-core';
import { ContactusSpaceService } from '@sneat/contactus-services';
import {
	computeSpaceRefFromSpaceContext,
	ISpaceContext,
} from '@sneat/space-models';
import { BehaviorSubject, map, Subject, Subscription, takeUntil } from 'rxjs';
import { BasicContactFormModule } from '../basic-contact-form';
import { ContactsComponent } from '../contacts-component/contacts.component';
import { LocationFormComponent } from '../location-form';
import { NewCompanyFormComponent } from '../new-company-form';
import { IContactSelectorOptions } from './contacts-selector.interfaces';

@Component({
	selector: 'sneat-contacts-selector',
	templateUrl: './contacts-selector.component.html',
	imports: [
		IonicModule,
		FormsModule,
		SelectFromListComponent,
		LocationFormComponent,
		BasicContactFormModule,
		NewCompanyFormComponent,
		TitleCasePipe,
		TitleCasePipe,
		ContactsComponent,
	],
})
export class ContactsSelectorComponent
	extends SelectorBaseComponent<IContactWithSpace>
	implements IContactSelectorOptions
{
	private readonly parentChanged = new Subject<void>();

	parentTab: 'existing' | 'new' = 'existing';
	contactTab: 'existing' | 'new' = 'existing';

	public readonly $space = input.required<ISpaceContext>();
	protected readonly $spaceRef = computeSpaceRefFromSpaceContext(this.$space);
	protected readonly $spaceID = computed(() => this.$spaceRef().id);

	// We use it to cancel requests if space ID changed.
	protected readonly spaceID$ = new BehaviorSubject<string>('');

	@Input() parentIcon = 'business-outline';
	@Input() contactIcon = 'business-outline';

	@Input() title = 'Contacts selector';
	@Input() contactRole?: ContactRole;
	@Input() parentType?: ContactType;
	@Input() parentRole?: ContactRole;
	@Input() contactType?: ContactType;
	@Input() excludeContactIDs?: string[];
	@Input() excludeParentIDs?: string[];

	@Input() onSelected?: (
		items: readonly IContactWithSpace[] | null,
	) => Promise<void>;

	readonly contactRoles: ISelectItem[] = [
		{ id: 'agent', title: 'Agent', iconName: 'body-outline' },
		{ id: 'buyer', title: 'Buyer', iconName: 'cash-outline' },
		{ id: 'freight_agent', title: 'Freight Agent', iconName: 'train-outline' },
		{ id: 'dispatcher', title: 'Dispatcher', iconName: 'business-outline' },
		{ id: 'shipper', title: 'Shipper', iconName: 'boat-outline' },
	];

	// @Input() public contacts?: IContactContext[];

	private contactBriefsSub?: Subscription;

	private allContacts?: IContactWithSpace[];
	//
	protected parentContacts?: readonly IContactWithSpace[];

	protected readonly $contacts = signal<
		readonly IContactWithCheck[] | undefined
	>(undefined);

	protected selectedParent?: IContactWithSpace;
	protected selectedContact?: IContactWithSpace;

	protected parentContactID?: string;
	protected selectedSubContactID?: string;

	// private readonly items$ = new Subject<readonly IContactWithSpace[]>();
	// public readonly items = this.items$.asObservable();

	protected parentItems?: ISelectItem[];

	protected contactItems?: ISelectItem[];

	get label(): string {
		const r = this.contactRole;
		return r ? r[0].toUpperCase() + r.substr(1) : 'Contact';
	}

	constructor(
		modalController: ModalController,
		@Inject(CONTACT_ROLES_BY_TYPE)
		private readonly contactRolesByType: ContactRolesByType,
		// private readonly contactService: ContactService,
		private readonly contactusSpaceService: ContactusSpaceService,
	) {
		super('ContactSelectorComponent', modalController);
		effect(() => this.spaceID$.next(this.$spaceID()));
		effect(() => {
			this.subscribeForData();
		});
	}

	private subscribeForData(): void {
		console.log(`ContactSelectorComponent.subscribeForData()`);
		this.contactBriefsSub?.unsubscribe();
		this.watchContactBriefs();
	}

	private watchContactBriefs(): void {
		const spaceID = this.$spaceID();
		this.contactBriefsSub = this.contactusSpaceService
			.watchContactBriefs(spaceID)
			.pipe(
				takeUntil(this.spaceID$),
				map((contacts) => {
					const space = this.$space();
					return contacts.map((c) => ({ ...c, space }));
				}),
			)
			.subscribe((contacts) => {
				this.allContacts = contacts;
				console.log(
					'ContactSelectorComponent.watchContactBriefs() => contacts:',
					contacts,
				);
				this.setContacts();
			});
	}

	private setContacts(): void {
		const filterByTypeRoleAndParentID =
			(t?: ContactType, r?: ContactRole, parentID?: string) =>
			(c: IContactWithBrief) => {
				const roleIDs: ContactRole[] = [];
				if (r) {
					roleIDs.push(r);
					if (t && r) {
						const role = this.contactRolesByType[t]?.find(
							(role) => role.id === r,
						);
						if (role?.canBeImpersonatedByRoles?.length) {
							roleIDs.push(...role.canBeImpersonatedByRoles);
						}
					}
				}
				return (
					(!t || c.brief?.type === t) &&
					(!r || roleIDs.some((roleID) => c.brief?.roles?.includes(roleID))) &&
					(!parentID || c.brief?.parentID === parentID)
				);
			};
		const allContactBriefs = this.allContacts;
		this.parentContacts =
			this.parentType || this.parentRole
				? allContactBriefs?.filter(
						filterByTypeRoleAndParentID(this.parentType, this.parentRole),
					) || []
				: undefined;
		this.$contacts.set(
			allContactBriefs?.filter(
				filterByTypeRoleAndParentID(
					this.contactType,
					this.contactRole,
					this.parentContactID,
				),
			),
		);

		const removeExcluded = (ids?: string[]) => (c: IContactWithBrief) =>
			!ids?.includes(c.id);
		this.contactItems = this.$contacts()
			?.filter(removeExcluded(this.excludeContactIDs))
			.map(this.getChildItem);
		console.log('ContactSelectComponent.contactItems:', this.contactItems);
		this.parentItems = this.parentContacts
			?.filter(removeExcluded(this.excludeParentIDs))
			.map(this.getChildItem);

		if (this.parentType || this.parentRole) {
			if (
				!this.parentContactID &&
				this.parentContacts &&
				!this.parentContacts.length
			) {
				this.parentTab = 'new';
			}
		}
		if (this.$contacts && !this.$contacts.length) {
			this.contactTab = 'new';
		}
		console.log(
			'setContacts',
			this.allContacts,
			this.contactRole,
			this.contactType,
			this.$contacts,
			this.parentType,
			this.parentRole,
			this.parentContactID,
			this.parentContacts,
		);
	}

	private readonly getParentItem = (c: IContactContext): ISelectItem => ({
		id: c.id,
		emoji: countryFlagEmoji(c.brief?.countryID),
		title: `${c.brief?.title || c.id}`,
		iconName: this.parentIcon,
	});

	private readonly getChildItem = (c: IContactWithBrief): ISelectItem => {
		const { brief } = c;
		let title = brief.title;
		if (!title && brief.names) {
			title = getFullName(brief.names);
		}
		return {
			id: c.id,
			title: title || c.id,
			emoji: countryFlagEmoji(brief.countryID),
			iconName: this.contactIcon,
		};
	};

	protected onLocationCreated(contact: IContactWithBrief): void {
		// contact = {
		// 	...contact,
		// 	parentContact: this.selectedParent,
		// };
		// const c = { ...contact, brief: contact.brief };
		this.emitOnSelected({ ...contact, space: this.$spaceRef() });
		this.close(undefined);
	}

	protected onParentContactIDChanged(contactID: string): void {
		console.log('ContactSelectComponent.onParentContactSelected()', contactID);
		const parentContact = this.parentContacts?.find((c) => c.id === contactID);
		this.onParentContactChanged(parentContact);
	}

	protected onParentContactCreated(contact: IContactWithBrief): void {
		const parentContact = { ...contact, space: this.$spaceRef() };
		this.parentItems?.push(this.getParentItem(parentContact));
		this.onParentContactChanged(parentContact);
	}

	protected onContactCreated(contact: IContactWithBrief): void {
		// contact = {
		// 	...contact,
		// 	parentContact: this.selectedContact,
		// };
		// this.selectedSubContactID = contact?.id
		this.selectedContact = { ...contact, space: this.$spaceRef() };
		this.emitOnSelected(this.selectedContact);
	}

	protected onSubContactCreated(contact: IContactWithBrief): void {
		console.log('ContactSelectComponent.onSubContactCreated()', contact);
		this.selectedSubContactID = contact.id;
		const selectedContact: IContactWithSpace = {
			...contact,
			space: this.$spaceRef(),
		};
		this.selectedContact = selectedContact;
		this.emitOnSelected(selectedContact);
	}

	private onParentContactChanged(contact?: IContactWithSpace): void {
		console.log('ContactSelectComponent.onParentContactChanged()', contact);
		this.parentTab = 'existing';
		this.selectedParent = contact || undefined;
		this.parentContactID = contact?.id;
		this.setContacts();
		this.parentChanged.next();
	}

	protected onContactSelected(contactID: string): void {
		console.log('ContactSelectComponent.onContactSelected()', contactID);
		this.selectedSubContactID = contactID;
		const selectedContact = this.$contacts()?.find((c) => c.id === contactID);
		if (!selectedContact) {
			console.error('contact not found by ID', contactID, this.$contacts);
			return;
		}
		this.selectedContact = { ...selectedContact, space: this.$spaceRef() };
		this.emitOnSelected(this.selectedContact);
		// if (this.selectedParent?.dto) {
		// 	const contactBrief = this.selectedParent.dto.relatedContacts?.find(c => c.id === contactID);
		// 	if (contactBrief) {
		// 		const subContact: IContactContext = contactContextFromBrief(this.team, contactBrief);
		// 		this.emitOnSelected(subContact);
		// 	}
		// } else {
		//
		// }
		this.close(undefined);
	}

	protected save(event: Event): void {
		console.log('ContactSelectComponent.save(event)', event);
	}

	// protected onContactSelected2(contactID: string): void {
	// 	console.log('onContactSelected()', contactID);
	// 	this.selectedContact = this.contacts?.find(c => c.id === contactID);
	// 	if (!this.contactType && this.selectedContact) {
	// 		this.emitOnSelected(this.selectedContact);
	// 		this.close(undefined);
	// 		return;
	// 	}
	// 	const contactType = this.contactType;
	// 	if (contactType) {
	// 		this.contactItems = this.selectedContact?.dto?.relatedContacts?.filter(c => c.type === contactType).map(c => ({
	// 			id: c.id,
	// 			title: ((c.title + ' - ') + (c.address?.lines?.join(', ') || '')).trim(),
	// 		}));
	// 	}
	// 	this.newLocationContact = {
	// 		id: '',
	// 		team: this.team,
	// 		dto: {
	// 			type: 'location',
	// 			countryID: this.selectedContact?.dto?.countryID,
	// 			address: this.selectedContact?.dto?.address,
	// 		},
	// 	};
	// }

	protected emitOnSelected(contact?: IContactWithSpace): void {
		console.log('ContactSelectorComponent.emitOnSelected()', contact);
		if (this.onSelected) {
			this.onSelected(contact ? [contact] : null).catch(
				this.errorLogger.logErrorHandler('Failed to call onSelected callback'),
			);
		} else {
			console.warn(
				'instance ContactSelectorComponent has unset `onSelected` input callback.',
			);
		}
	}
}
