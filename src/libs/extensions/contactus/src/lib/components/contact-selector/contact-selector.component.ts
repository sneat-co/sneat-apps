import { AfterViewInit, Component, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ISelectItem, SelectorBaseComponent } from '@sneat/components';
import { ContactRole, ContactType } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { contactContextFromBrief, IContactContext, ITeamContext } from '@sneat/team/models';
import { Observable, Subject, Subscription } from 'rxjs';
import { ContactService } from '../../services';
import { IContactSelectorOptions } from './contact-selector.service';

@Component({
	selector: 'sneat-contact-selector',
	templateUrl: './contact-selector.component.html',
})
export class ContactSelectorComponent
	extends SelectorBaseComponent
	implements IContactSelectorOptions,
		OnInit,
		OnChanges,
		OnDestroy {

	private readonly destroyed = new Subject<void>();
	private readonly parentChanged = new Subject<void>();

	parentTab: 'existing' | 'new' = 'existing';
	contactTab: 'existing' | 'new' = 'existing';

	@Input() parentIcon = 'business-outline';
	@Input() contactIcon = 'business-outline';
	@Input() team: ITeamContext = { id: '' };
	@Input() contactRole?: ContactRole;
	@Input() parentRole?: ContactRole;
	@Input() contactType?: ContactType;
	@Input() excludeContacts?: IContactContext[];
	@Input() excludeParents?: IContactContext[];
	@Input() onSelected?: (items: IContactContext[] | null) => void;

	readonly contactRoles: ISelectItem[] = [
		{ id: 'agent', title: 'Agent', iconName: 'body-outline' },
		{ id: 'buyer', title: 'Buyer', iconName: 'cash-outline' },
		{ id: 'carrier', title: 'Carrier', iconName: 'train-outline' },
		{ id: 'dispatcher', title: 'Dispatcher', iconName: 'business-outline' },
		{ id: 'shipper', title: 'Shipper', iconName: 'boat-outline' },
	];


	// @Input() public contacts?: IContactContext[];

	private parentsSub?: Subscription;

	private parentContacts?: IContactContext[];
	private contacts?: IContactContext[];

	protected selectedParent?: IContactContext;
	protected selectedContact?: IContactContext;
	protected newLocationContact?: IContactContext;

	protected selectedContactID?: string;
	protected selectedSubContactID?: string;
	private readonly items$ = new Subject<IContactContext[]>;
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
		private readonly contactService: ContactService,
	) {
		super(errorLogger, modalController);
	}


	ngOnInit(): void {
		console.log('ngOnInit()');
		this.subscribeForData();
	}

	ngOnChanges(changes: SimpleChanges): void {
		console.log('ngOnChanges()', changes);
		if (changes['role'] || changes['team']) {
			this.subscribeForData();
		}
	}

	ngOnDestroy(): void {
		this.destroyed.next();
		this.destroyed.complete();
	}

	subscribeForData(): void {
		console.log('ContactSelectorComponent.subscribeForData()');
		this.parentsSub?.unsubscribe();
		if (!this.team) {
			return;
		}
		if (this.parentRole) {
			this.watchParents();
		} else {
			this.watchContacts();
		}
	}

	private watchContacts(): void {
		this.parentsSub = this.contactService.watchContactsByRole(
			this.team,
			{ role: this.contactRole, status: 'active' },
		).subscribe(contacts => {
			this.contacts = contacts;
			this.contactItems = contacts
				.filter(c => !this?.excludeContacts?.some(ec => ec.id === c.id))
				.map(c => ({
					id: c.id,
					title: c.brief?.title || c.id,
					iconName: this.parentIcon,
				}));
			console.log('contactItems', this.contactItems);
		});
	}

	private watchParents(): void {
		this.parentsSub = this.contactService.watchContactsByRole(
			this.team,
			{ role: this.parentRole, status: 'active' },
		).subscribe(contacts => {
			this.parentContacts = contacts;
			this.parentItems = contacts
				.filter(c => !this?.excludeParents?.some(ec => ec.id === c.id))
				.map(this.getParentItem);

			// console.log('contacts', this.contacts);
			console.log('items', this.parentItems);
		});
	}

	private readonly getParentItem = (c: IContactContext): ISelectItem => ({
		id: c.id,
		title: c.brief?.title || c.id,
		iconName: this.parentIcon,
	});

	protected onLocationCreated(contact: IContactContext): void {
		contact = {
			...contact,
			parentContact: this.selectedContact,
		};
		this.emitOnSelected(contact);
		this.close(undefined);
	}

	protected onParentContactIDChanged(contactID: string): void {
		console.log('onParentContactSelected()', contactID);
		const parentContact = this.parentContacts?.find(c => c.id === contactID);
		this.onParentContactChanged(parentContact);
	}

	protected onParentContactCreated(contact: IContactContext): void {
		this.parentItems?.push(this.getParentItem(contact));
		this.onParentContactChanged(contact);
	}

	protected onContactCreated(contact: IContactContext): void {
		this.selectedContact = contact;
		this.emitOnSelected(contact);
	}


	private onParentContactChanged(contact?: IContactContext): void {
		this.parentTab = 'existing';
		this.selectedParent = contact;
		this.selectedContactID = contact?.id;
		const relatedContacts = this.selectedParent?.dto?.relatedContacts;
		this.contacts = relatedContacts?.map(brief => ({
			id: brief.id,
			brief,
			team: this.team,
			parentContact: this.selectedParent,
		}));
		this.contactItems = relatedContacts?.map(c => ({
			id: c.id,
			title: c.title || c.id,
		})) || [];
		this.parentChanged.next();
	}

	protected onContactSelected(contactID: string): void {
		console.log('onContactSelected()', contactID);
		this.selectedSubContactID = contactID;
		this.selectedContact = this.contacts?.find(c => c.id === contactID);
		if (!this.selectedContact) {
			console.error('contact not found by ID', contactID, this.contacts);
		}
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
		console.log('emitOnSelected()', contact);
		if (this.onSelected) {
			this.onSelected(contact ? [contact] : null);
		} else {
			console.warn('instance ContactSelectorComponent has unset `onSelected` input callback.');
		}
	}
}
