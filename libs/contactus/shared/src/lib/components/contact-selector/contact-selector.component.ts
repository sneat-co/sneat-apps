import { CommonModule } from '@angular/common';
import {
	Component,
	Inject,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { CONTACT_ROLES_BY_TYPE, ContactRolesByType } from '@sneat/app';
import {
	countryFlagEmoji,
	ISelectItem,
	SelectFromListModule,
	SelectorBaseComponent,
} from '@sneat/components';
import { ContactRole, ContactType } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	ContactService,
	ContactusTeamService,
} from '@sneat/contactus-services';
import { IContactContext, ITeamContext } from '@sneat/team-models';
import { map, Subject, Subscription } from 'rxjs';
import { BasicContactFormModule } from '../basic-contact-form';
import { LocationFormModule } from '../location-form';
import { NewCompanyFormModule } from '../new-company-form';
import {
	ContactSelectorService,
	IContactSelectorOptions,
} from './contact-selector.service';

export interface IContactSelectorProps {
	readonly team: ITeamContext;
	readonly contactRole?: ContactRole;
	readonly contactType?: ContactType;
	readonly parentType?: ContactType;
	readonly parentRole?: ContactRole;
	readonly parentContact?: IContactContext;
	readonly subType?: ContactRole;
	readonly subRoleRequired?: boolean;
	readonly excludeContacts?: readonly IContactContext[];
}

@Component({
	selector: 'sneat-contact-selector',
	templateUrl: './contact-selector.component.html',
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		SelectFromListModule,
		LocationFormModule,
		BasicContactFormModule,
		NewCompanyFormModule,
	],
	providers: [ContactSelectorService],
})
export class ContactSelectorComponent
	extends SelectorBaseComponent
	implements IContactSelectorOptions, OnInit, OnChanges, OnDestroy
{
	private readonly destroyed = new Subject<void>();
	private readonly parentChanged = new Subject<void>();

	parentTab: 'existing' | 'new' = 'existing';
	contactTab: 'existing' | 'new' = 'existing';

	@Input() parentIcon = 'business-outline';
	@Input() contactIcon = 'business-outline';
	@Input() team: ITeamContext = { id: '' };
	@Input() contactRole?: ContactRole;
	@Input() parentType?: ContactType;
	@Input() parentRole?: ContactRole;
	@Input() contactType?: ContactType;
	@Input() excludeContactIDs?: string[];
	@Input() excludeParentIDs?: string[];
	@Input() onSelected?: (items: IContactContext[] | null) => void;

	readonly contactRoles: ISelectItem[] = [
		{ id: 'agent', title: 'Agent', iconName: 'body-outline' },
		{ id: 'buyer', title: 'Buyer', iconName: 'cash-outline' },
		{ id: 'freight_agent', title: 'Freight Agent', iconName: 'train-outline' },
		{ id: 'dispatcher', title: 'Dispatcher', iconName: 'business-outline' },
		{ id: 'shipper', title: 'Shipper', iconName: 'boat-outline' },
	];

	// @Input() public contacts?: IContactContext[];

	private contactBriefsSub?: Subscription;

	private allContacts?: IContactContext[];
	//
	protected parentContacts?: IContactContext[];
	protected contacts?: IContactContext[];

	protected selectedParent?: IContactContext;
	protected selectedContact?: IContactContext;

	protected parentContactID?: string;
	protected selectedSubContactID?: string;

	private readonly items$ = new Subject<IContactContext[]>();
	public readonly items = this.items$.asObservable();

	protected parentItems?: ISelectItem[];

	protected contactItems?: ISelectItem[];

	get label(): string {
		const r = this.contactRole;
		return r ? r[0].toUpperCase() + r.substr(1) : 'Contact';
	}

	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		modalController: ModalController,
		@Inject(CONTACT_ROLES_BY_TYPE)
		private readonly contactRolesByType: ContactRolesByType,
		private readonly contactService: ContactService,
		private readonly contactusTeamService: ContactusTeamService,
	) {
		super(errorLogger, modalController);
	}

	ngOnInit(): void {
		console.log('ngOnInit()');
		this.subscribeForData('ngOnInit');
	}

	ngOnChanges(changes: SimpleChanges): void {
		console.log('ContactSelectorComponent.ngOnChanges()', changes);
		if (changes['team']) {
			this.subscribeForData('ngOnChanges');
		}
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}

	subscribeForData(calledFrom: 'ngOnInit' | 'ngOnChanges'): void {
		console.log(
			`ContactSelectorComponent.subscribeForData(calledFrom=${calledFrom})`,
		);
		this.contactBriefsSub?.unsubscribe();
		if (!this.team) {
			return;
		}
		this.watchContactBriefs();
	}

	private watchContactBriefs(): void {
		const team = this.team;
		this.contactBriefsSub = this.contactusTeamService
			.watchContactBriefs(this.team)
			.pipe(map((contacts) => contacts.map((c) => ({ ...c, team }))))
			.subscribe((contacts) => {
				this.allContacts = contacts;
				this.setContacts();
			});
	}

	private setContacts(): void {
		const filterByTypeRoleAndParentID =
			(t?: ContactType, r?: ContactRole, parentID?: string) =>
			(c: IContactContext) => {
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
		this.contacts = allContactBriefs?.filter(
			filterByTypeRoleAndParentID(
				this.contactType,
				this.contactRole,
				this.parentContactID,
			),
		);

		const removeExcluded = (ids?: string[]) => (c: IContactContext) =>
			!ids?.includes(c.id);
		this.contactItems = this.contacts
			?.filter(removeExcluded(this.excludeContactIDs))
			.map(this.getChildItem);
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
		if (this.contacts && !this.contacts.length) {
			this.contactTab = 'new';
		}
		console.log(
			'setContacts',
			this.allContacts,
			this.contactRole,
			this.contactType,
			this.contacts,
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

	private readonly getChildItem = (c: IContactContext): ISelectItem => ({
		id: c.id,
		title: `${countryFlagEmoji(c.brief?.countryID)} ${c.brief?.title || c.id}`,
		iconName: this.contactIcon,
	});

	protected onLocationCreated(contact: IContactContext): void {
		// contact = {
		// 	...contact,
		// 	parentContact: this.selectedParent,
		// };
		const c = { ...contact, brief: contact.dto };
		this.emitOnSelected(c);
		this.close(undefined);
	}

	protected onParentContactIDChanged(contactID: string): void {
		console.log('onParentContactSelected()', contactID);
		const parentContact = this.parentContacts?.find((c) => c.id === contactID);
		this.onParentContactChanged(parentContact);
	}

	protected onParentContactCreated(contact: IContactContext): void {
		const parentContact = { ...contact, brief: contact.dto, team: this.team };
		this.parentItems?.push(this.getParentItem(parentContact));
		this.onParentContactChanged(parentContact);
	}

	protected onContactCreated(contact: IContactContext): void {
		// contact = {
		// 	...contact,
		// 	parentContact: this.selectedContact,
		// };
		// this.selectedSubContactID = contact?.id
		this.selectedContact = { ...contact, brief: contact.dto };
		this.emitOnSelected(this.selectedContact);
	}

	protected onSubContactCreated(contact: IContactContext): void {
		console.log('onSubContactCreated()', contact);
		this.selectedSubContactID = contact.id;
		this.selectedContact = contact;
		this.emitOnSelected(contact);
	}

	private onParentContactChanged(contact?: IContactContext): void {
		console.log('onParentContactChanged()', contact);
		this.parentTab = 'existing';
		this.selectedParent = contact || undefined;
		this.parentContactID = contact?.id;
		this.setContacts();
		this.parentChanged.next();
	}

	protected onContactSelected(contactID: string): void {
		console.log('onContactSelected()', contactID);
		this.selectedSubContactID = contactID;
		this.selectedContact = this.contacts?.find((c) => c.id === contactID);
		if (!this.selectedContact) {
			console.error('contact not found by ID', contactID, this.contacts);
		}
		const contact = this.selectedContact;
		this.emitOnSelected(contact);
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

	protected emitOnSelected(contact?: IContactContext): void {
		console.log('ContactSelectorComponent.emitOnSelected()', contact);
		if (this.onSelected) {
			this.onSelected(contact ? [contact] : null);
		} else {
			console.warn(
				'instance ContactSelectorComponent has unset `onSelected` input callback.',
			);
		}
	}
}
