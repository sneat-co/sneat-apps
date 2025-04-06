import { TitleCasePipe } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	EffectRef,
	Inject,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	signal,
	SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	IonButton,
	IonButtons,
	IonCard,
	IonCardHeader,
	IonCardSubtitle,
	IonContent,
	IonFooter,
	IonHeader,
	IonIcon,
	IonItem,
	IonItemDivider,
	IonLabel,
	IonSegment,
	IonSegmentButton,
	IonSpinner,
	IonText,
	IonToolbar,
} from '@ionic/angular/standalone';
import { CONTACT_ROLES_BY_TYPE, ContactRolesByType } from '@sneat/app';
import { getFullName } from '@sneat/auth-models';
import { countryFlagEmoji } from '@sneat/components';
import {
	ISelectItem,
	SelectFromListComponent,
	SelectorModalComponent,
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
import { IContactAddEventArgs } from '../contact-events';
import { ContactsComponent } from '../contacts-component/contacts.component';
import { LocationFormComponent } from '../location-form';
import { NewCompanyFormComponent } from '../new-company-form';
import {
	NewContactFormCommand,
	NewContactFormComponent,
} from '../new-contact-form/new-contact-form.component';
import { IContactSelectorOptions } from './contacts-selector.interfaces';

@Component({
	selector: 'sneat-contacts-selector',
	templateUrl: './contacts-selector.component.html',
	imports: [
		FormsModule,
		SelectFromListComponent,
		LocationFormComponent,
		BasicContactFormModule,
		NewCompanyFormComponent,
		TitleCasePipe,
		TitleCasePipe,
		ContactsComponent,
		NewContactFormComponent,
		IonButton,
		IonLabel,
		IonSpinner,
		IonIcon,
		IonButtons,
		IonFooter,
		IonToolbar,
		IonContent,
		IonCard,
		IonSegment,
		IonSegmentButton,
		IonCardSubtitle,
		IonCardHeader,
		IonText,
		IonItemDivider,
		IonHeader,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactsSelectorComponent
	extends SelectorModalComponent<IContactWithSpace>
	implements IContactSelectorOptions, OnInit, OnChanges, OnDestroy
{
	private readonly parentChanged = new Subject<void>();

	protected readonly $parentTab = signal<'existing' | 'new'>('existing');

	protected onParentTabChanged = (event: CustomEvent) => {
		this.$parentTab.set(event.detail.value);
	};

	protected readonly $contactTab = signal<'existing' | 'new'>('existing');

	protected onContactTabChanged = (event: CustomEvent) => {
		this.$contactTab.set(event.detail.value);
		if (this.$contactTab() === 'existing') {
			this.selectGroupAndRole$.next({ event });
			// this.newContactCommand$.next('reset');
		}
	};

	private spaceIDChangesCount = 0;

	@Input({ required: true }) space?: ISpaceContext;

	private effects?: readonly EffectRef[];

	// we can't yet use `$space = input.required` for modal component yet
	protected readonly $space = signal<ISpaceContext>({ id: '' });
	protected readonly $spaceRef = computeSpaceRefFromSpaceContext(this.$space);
	protected readonly $spaceID = computed(() => {
		const spaceID = this.$spaceRef().id;
		console.log(
			`ContactsSelectorComponent.$spaceID(spaceID=${spaceID})`,
			this.spaceIDChangesCount,
		);
		if (spaceID && !this.spaceIDChangesCount) {
			this.spaceIDChangesCount += 1;
			// this.setupEffects();
		}
		return spaceID;
	});

	private setupEffects(): void {
		console.log('ContactsSelectorComponent.setupEffects()');
		this.destroyEffects();
		this.effects = [effect(() => this.onSpaceIDChanged())];
		// runInInjectionContext(this.injector, () => {
		// 	this.effects = [effect(() => this.onSpaceIDChanged())];
		// });
	}

	private onSpaceIDChanged(): void {
		const spaceID = this.$spaceID();
		this.spaceID$.next(spaceID);
		this.watchContactBriefs();
	}

	// We use it to cancel request to ContactusSpace if space ID changed.
	protected readonly spaceID$ = new Subject<string>();

	@Input() parentIcon = 'business-outline';
	@Input() contactIcon = 'business-outline';

	@Input() title = 'Contacts selector';
	@Input() contactRoleID?: ContactRole;
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

	protected readonly newContactCommand$ = new Subject<NewContactFormCommand>();
	protected readonly $isNewContactCreating = signal(false);

	get label(): string {
		const r = this.contactRoleID;
		return r ? r[0].toUpperCase() + r.substr(1) : 'Contact';
	}

	constructor(
		@Inject(CONTACT_ROLES_BY_TYPE)
		private readonly contactRolesByType: ContactRolesByType,
		private readonly contactusSpaceService: ContactusSpaceService,
	) {
		super('ContactSelectorComponent');
		this.setupEffects();
	}

	public ngOnInit(): void {
		console.log('ContactsSelectorComponent.ngOnInit', this.space);
		if (this.space) {
			// When dynamically creating the component in modal ngOnChanges are not called.
			this.$space.set(this.space);
			// we need to call this as effects would not be set without something consumers
			// this.onSpaceIDChanged();
		}
	}

	override ngOnDestroy(): void {
		super.ngOnDestroy();
		this.destroyEffects();
	}

	private destroyEffects(): void {
		this.effects?.forEach((effect) => effect.destroy());
		this.effects = undefined;
	}

	public ngOnChanges(changes: SimpleChanges): void {
		console.log('ContactsSelectorComponent.ngOnChanges', this.space);
		if (changes['space']) {
			this.$space.set(this.space || { id: '' });
		}
	}

	private watchContactBriefs(): void {
		console.log('ContactsSelectorComponent.watchContactBriefs()');
		const spaceID = this.$spaceID();
		this.contactBriefsSub?.unsubscribe();
		this.contactBriefsSub = this.contactusSpaceService
			.watchContactBriefs(spaceID)
			.pipe(
				this.takeUntilDestroyed(),
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
					this.contactRoleID,
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
				this.$parentTab.set('new');
			}
		}
		// if (this.$contacts && !this.$contacts.length) {
		// 	this.contactTab = 'new';
		// }
		console.log(
			'setContacts',
			this.allContacts,
			this.contactRoleID,
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
		this.$parentTab.set('existing');
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

	protected cancel(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		this.modalController
			.dismiss()
			.catch(
				this.errorLogger.logErrorHandler(
					'Failed to close contacts selector modal',
				),
			);
	}

	protected readonly selectGroupAndRole$ = new BehaviorSubject<
		IContactAddEventArgs | undefined
	>(undefined);

	protected switchToNewContact(args: IContactAddEventArgs): void {
		console.log('switchToNewContact', args);
		args.event.stopPropagation();
		args.event.preventDefault();
		this.$contactTab.set('new');
		this.selectGroupAndRole$.next(args);
	}
}
