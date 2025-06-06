import { TitleCasePipe } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	computed,
	effect,
	EffectRef,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	signal,
	SimpleChanges,
	inject,
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
	IContactWithBriefAndSpace,
	ContactIdAndDboWithSpaceRef,
	IContactDbo,
	NewContactBaseDboAndSpaceRef,
} from '@sneat/contactus-core';
import { ContactusSpaceService } from '@sneat/contactus-services';
import {
	computeSpaceRefFromSpaceContext,
	ISpaceContext,
} from '@sneat/space-models';
import { BehaviorSubject, map, Subject, Subscription, takeUntil } from 'rxjs';
import { IContactAddEventArgs } from '../contact-events';
import { NewContactFormComponent } from '../contact-forms/new-contact';
import { ContactsComponent } from '../contacts-component/contacts.component';
import {
	NewCompanyFormComponent,
	NewContactFormCommand,
} from '../contact-forms/new-contact';
import { IContactSelectorOptions } from './contacts-selector.interfaces';

@Component({
	imports: [
		FormsModule,
		SelectFromListComponent,
		NewCompanyFormComponent,
		TitleCasePipe,
		TitleCasePipe,
		ContactsComponent,
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
		NewContactFormComponent,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'sneat-contacts-selector',
	templateUrl: './contacts-selector.component.html',
})
export class ContactsSelectorComponent
	extends SelectorModalComponent<IContactWithBriefAndSpace>
	implements IContactSelectorOptions, OnInit, OnChanges, OnDestroy
{
	private readonly contactRolesByType = inject<ContactRolesByType>(
		CONTACT_ROLES_BY_TYPE,
	);
	private readonly contactusSpaceService = inject(ContactusSpaceService);

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

	@Input() okButtonLabel = 'OK';

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

	protected readonly $contact = signal<IContactContext>({} as IContactContext);
	protected readonly $contactWithDbo = computed<ContactIdAndDboWithSpaceRef>(
		() => {
			const contact = this.$contact();
			let contactWithDbo: ContactIdAndDboWithSpaceRef | undefined;
			if (contact.dbo) {
				// Applying cast to ContactIdAndDboWithSpaceRef as seems to be a bug in TS
				contactWithDbo = contact as ContactIdAndDboWithSpaceRef;
			} else if (contact.brief) {
				contactWithDbo = { ...contact, dbo: contact.brief };
			} else {
				contactWithDbo = { ...contact, dbo: {} as IContactDbo };
			}
			return contactWithDbo;
		},
	);

	@Input() onSelected?: (
		items?: readonly IContactWithBriefAndSpace[],
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

	private allContacts?: IContactWithBriefAndSpace[];
	//
	protected parentContacts?: readonly IContactWithBriefAndSpace[];

	protected readonly $contacts = signal<
		readonly IContactWithCheck[] | undefined
	>(undefined);

	protected readonly $selectedContacts = computed(() =>
		this.$contacts()?.filter((c) => c.isChecked),
	);
	protected readonly $selectedContactsCount = computed(
		() => this.$selectedContacts()?.length || 0,
	);

	protected selectedParent?: IContactWithBriefAndSpace;
	protected selectedContact?: IContactWithCheck;

	protected parentContactID?: string;

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

	constructor() {
		super('ContactSelectorComponent');
		this.setupEffects();
	}

	public ngOnInit(): void {
		if (this.space) {
			// When dynamically creating the component in modal ngOnChanges are not called.
			this.$space.set(this.space);
			// we need to call this as effects would not be set without something consumers
			// this.onSpaceIDChanged();
		}
		if (this.contactType) {
			this.$contact.set({
				id: '',
				space: this.$spaceRef(),
				dbo: { type: this.contactType },
			});
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
			// we use @Input() due to modal not able to set signal property
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
		console.log('ContactsSelectorComponent.contactItems:', this.contactItems);
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

	protected onParentContactIDChanged(contactID: string): void {
		console.log(
			'ContactsSelectorComponent.onParentContactSelected()',
			contactID,
		);
		const parentContact = this.parentContacts?.find((c) => c.id === contactID);
		this.onParentContactChanged(parentContact);
	}

	protected onParentContactCreated(contact: ContactIdAndDboWithSpaceRef): void {
		const parentContact: IContactWithBriefAndSpace = {
			...contact,
			brief: contact.dbo,
		};
		this.parentItems?.push(this.getParentItem(parentContact));
		this.onParentContactChanged(parentContact);
	}

	protected onNewContactChanged(contact: NewContactBaseDboAndSpaceRef): void {
		this.$contact.set(contact as IContactContext);
	}

	protected onContactChanged(contact: IContactContext): void {
		this.$contact.set(contact);
	}

	protected onContactCreated(contact: IContactWithBrief): void {
		this.selectedContact = {
			...contact,
			space: this.$spaceRef(),
			isChecked: true,
		};
		this.emitOnSelected(this.selectedContact);
	}

	private onParentContactChanged(contact?: IContactWithBriefAndSpace): void {
		console.log('ContactsSelectorComponent.onParentContactChanged()', contact);
		this.$parentTab.set('existing');
		this.selectedParent = contact || undefined;
		this.parentContactID = contact?.id;
		this.setContacts();
		this.parentChanged.next();
	}

	protected onContactSelected(contactID: string): void {
		console.log('ContactsSelectorComponent.onContactSelected()', contactID);
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

	protected readonly $isSubmitting = signal(false);

	protected async submitSelected(event: Event): Promise<void> {
		console.log('ContactsSelectorComponent.ok()');

		event.stopPropagation();
		event.preventDefault();
		const selectedContacts = this.$selectedContacts();
		if (this.onSelected) {
			this.$isSubmitting.set(true);
			try {
				await this.onSelected(selectedContacts);
			} catch (e) {
				this.errorLogger.logError(e, 'failed to call onSelected callback');
				this.$isSubmitting.set(false);
			}
		} else {
			console.error('onSelected is not set');
		}
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

	protected emitOnSelected(contact?: IContactWithBriefAndSpace): void {
		console.log('ContactSelectorComponent.emitOnSelected()', contact);
		if (this.onSelected) {
			this.onSelected(contact ? [contact] : undefined).catch(
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

	protected readonly contactClicked = (
		event: Event,
		contact: IContactWithBrief,
	): void => {
		console.log('ContactsSelectorComponent.contactClicked()', contact);
		event.preventDefault();
		event.stopPropagation();
		this.$contacts.update((contacts) =>
			contacts?.map((c) =>
				c.id === contact.id ? { ...c, isChecked: !c.isChecked } : c,
			),
		);
		console.log(
			'ContactsSelectorComponent.contactClicked() => $selectedContacts:',
			this.$selectedContacts(),
		);
	};
}
