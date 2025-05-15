import {
	Component,
	computed,
	EventEmitter,
	inject,
	input,
	Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	NavController,
	IonBadge,
	IonButton,
	IonButtons,
	IonCard,
	IonCol,
	IonGrid,
	IonIcon,
	IonItem,
	IonLabel,
	IonList,
	IonRow,
	IonSegment,
	IonSegmentButton,
	IonText,
	ModalController,
} from '@ionic/angular/standalone';
import { SneatUserService } from '@sneat/auth-core';
import { ContactTitlePipe } from '@sneat/components';
import {
	ContactService,
	IUpdateContactRequest,
} from '@sneat/contactus-services';
import { IIdAndBriefAndOptionalDbo } from '@sneat/core';
import {
	ContactType,
	IContactBrief,
	IContactDbo,
	IContactContext,
	Gender,
	IContactWithOptionalDbo,
} from '@sneat/contactus-core';
import {
	getRelatedItemByKey,
	IRelatedTo,
	ISpaceModuleItemRef,
} from '@sneat/dto';
import { WithSpaceInput } from '@sneat/space-components';
import { SneatBaseComponent } from '@sneat/ui';
import { ContactNamesModalComponent } from '../../modals/contact-names-modal/contact-names-modal.component';
import { UserSpaceBriefProvider } from '../../providers/user-space-brief.provider';
import { ContactCommChannelsComponent } from '../contact-comm-channels';
import { ContactDobComponent } from '../contact-dob';
import { ContactRelationshipFormComponent } from '../contact-forms/relationship-form/contact-relationship-form.component';
import { ContactLocationsComponent } from '../contact-locations';
import { ContactModulesMenuComponent } from '../contact-modules-menu';
import { ContactRolesInputComponent } from '../contact-roles-input';
import { GenderFormComponent } from '../contact-forms';
import { RelatedContactsComponent } from './related-contacts.component';

@Component({
	providers: [ModalController],
	imports: [
		ContactDobComponent,
		ContactModulesMenuComponent,
		ContactCommChannelsComponent,
		ContactRolesInputComponent,
		ContactLocationsComponent,
		GenderFormComponent,
		ContactTitlePipe,
		IonGrid,
		IonRow,
		IonCol,
		IonCard,
		IonItem,
		IonLabel,
		IonButtons,
		IonButton,
		IonIcon,
		IonList,
		IonSegment,
		IonSegmentButton,
		FormsModule,
		RelatedContactsComponent,
		IonBadge,
		IonText,
		ContactRelationshipFormComponent,
	],
	selector: 'sneat-contact-details',
	templateUrl: './contact-details.component.html',
})
export class ContactDetailsComponent extends WithSpaceInput {
	public readonly $contact = input.required<IContactContext | undefined>();
	protected readonly $contactID = computed(() => this.$contact()?.id);

	@Output() readonly contactChange = new EventEmitter<
		IContactContext | undefined
	>();

	// protected readonly $relatedTo = computed<IRelatedTo | undefined>(() => {
	// 	const key = this.$relatedToContactOfCurrentUser(),
	// 		contact = this.$contact();
	// 	if (!key || !contact?.dbo) {
	// 		return undefined;
	// 	}
	// 	return {
	// 		key,
	// 		title: '',
	// 		related: contact.dbo.related || {},
	// 	};
	// });

	protected readonly $relatedTo = computed<IRelatedTo | undefined>(() => {
		const contact = this.$contact();
		const userSpaceContactID = this.$userSpaceContactID();
		if (!contact?.id || !userSpaceContactID) {
			return undefined;
		}
		return {
			key: {
				spaceID: this.$spaceID(),
				module: 'contactus',
				collection: 'contacts',
				itemID: userSpaceContactID,
			},
			related: contact.dbo ? contact.dbo.related || {} : undefined,
			title: '', // pass empty string as we don't want to display name of the contact twice
		};
	});

	protected readonly $showRolesTab = computed(
		() => this.$spaceType() !== 'family',
	);

	protected readonly $isMember = computed(
		() => !!this.$contact()?.brief?.roles?.includes('member'),
	);

	private readonly modalController = inject(ModalController);

	protected readonly $contactWithBriefAndOptionalDbo = computed<
		IContactWithOptionalDbo | undefined
	>(() => {
		const contact = this.$contact();
		return contact?.brief
			? (contact as IIdAndBriefAndOptionalDbo<IContactBrief, IContactDbo>)
			: undefined;
	});

	protected tab: 'communicationChannels' | 'roles' | 'peers' | 'locations' =
		'peers';

	private readonly userService = inject(SneatUserService);

	constructor() {
		super('ContactDetailsComponent');
	}

	// this.setRelatedToCurrentUser();
	// this.setRelatedAs(spaceID, this.userContactID);
	private readonly userSpaceBrief = new UserSpaceBriefProvider(
		this.destroyed$,
		this.$spaceID,
		this.userService,
	);

	protected $userSpaceContactID = this.userSpaceBrief.$userContactID;

	protected readonly $relatedToContactOfCurrentUser = computed<
		ISpaceModuleItemRef | undefined
	>(() => {
		const userContactID = this.userSpaceBrief.$userContactID();
		return userContactID
			? {
					module: 'contactus',
					collection: 'contacts',
					spaceID: this.$spaceID() || '',
					itemID: userContactID,
				}
			: undefined;
	});

	protected readonly $rolesOfItem = computed(() => {
		const spaceID = this.$spaceID();
		const contact = this.$contact();
		const userContactID = this.userSpaceBrief.$userContactID();
		if (!contact || !userContactID || !spaceID) {
			return undefined;
		}
		const relatedContact = getRelatedItemByKey(contact.dbo?.related, {
			module: 'contactus',
			collection: 'contacts',
			spaceID,
			itemID: userContactID,
		});
		return relatedContact?.rolesOfItem;
	});

	protected readonly $relatedToUserAs = computed(() => {
		const relationshipIDs = Object.keys(this.$rolesOfItem() || {});
		if (relationshipIDs.length === 0) {
			return undefined;
		}
		if (relationshipIDs.includes('child')) {
			return 'child';
		}
		if (relationshipIDs.includes('spouse')) {
			return 'spouse';
		}
		return undefined;
	});

	protected readonly $relatedToUserAsBadgeText = computed(() => {
		const contact = this.$contact();
		const relatedToUserAs = this.$relatedToUserAs();
		if (contact?.brief?.gender && relatedToUserAs) {
			switch (relatedToUserAs) {
				case 'child':
					switch (contact.brief.gender) {
						case 'male':
							return 'My son';
						case 'female':
							return 'My daughter';
					}
					break;
				case 'spouse':
					switch (contact.brief.gender) {
						case 'male':
							return 'My husband';
						case 'female':
							return 'My wife';
					}
					break;
			}
		}
		return undefined;
	});

	protected get currentUserID() {
		return this.userService.currentUserID;
	}

	protected hideForContactTypes(contactTypes: ContactType[]): boolean {
		const contact = this.$contact();
		return !!contact?.brief?.type && !contactTypes.includes(contact.brief.type);
	}

	protected get currentUserId() {
		return this.userService.currentUserID;
	}

	// protected goMember(id: string): void {
	// 	const space = this.$space();
	// 	if (!space) {
	// 		throw new Error('Can not navigate to member without team context');
	// 	}
	// 	this.spaceNavService.navigateToMember(this.navController, {
	// 		id,
	// 		space,
	// 	});
	// }

	// protected addRelatedContact(event: Event): void {
	// 	event.stopPropagation();
	// 	alert('Not implemented yet');
	// }

	protected async openEditNamesDialog(): Promise<void> {
		const contact = this.$contact();
		if (!contact) {
			throw new Error('this.$contact() is not set');
		}
		const modal = await this.modalController.create({
			component: ContactNamesModalComponent,
			componentProps: {
				spaceID: this.$spaceID(),
				contactID: contact.id,
				names: contact.dbo?.names,
			},
		});
		await modal.present();
	}

	private newUpdateContactRequest(): IUpdateContactRequest {
		const contactID = this.$contact()?.id;
		const spaceID = this.$spaceID();
		if (!contactID || !spaceID) {
			throw new Error(
				'ContactDetailsComponent.newUpdateContactRequest() - contactID or spaceID is not set',
			);
		}
		return { spaceID, contactID };
	}

	protected onGenderChanged(gender: Gender): void {
		const contact = this.$contact();
		if (!contact) {
			throw new Error('Contact is not set');
		}
		if (contact.dbo) {
			this.contactChange.emit({
				...contact,
				dbo: { ...contact.dbo, gender },
			});
		}
	}

	// changeGender(event: Event): void {
	// 	const gender = (event as CustomEvent).detail.value as Gender;
	// 	console.debug(`CommuneMemberPageComponent.changeGender(${gender})`);
	//
	// 	// this.startCommuneReadwriteTx([CommuneKind, MemberKind], (tx, communeDto) =>
	// 	// 	this.membersService.changeMemberPrimaryField(tx, this.memberId, { name: 'gender', value: gender }, communeDto))
	// 	// 	.subscribe({
	// 	// 		next: memberDto => {
	// 	// 			this.setMemberInfo(newCommuneMemberInfo(memberDto));
	// 	// 			this.setMemberDto(memberDto);
	// 	// 		},
	// 	// 		error: this.params.errorLogger.logErrorHandler('Failed to set member gender'),
	// 	// 	});
	// }
}
