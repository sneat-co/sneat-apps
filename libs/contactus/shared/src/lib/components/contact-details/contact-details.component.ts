import {
	Component,
	computed,
	inject,
	input,
	OnChanges,
	OnInit,
	SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular';
import {
	IonButton,
	IonButtons,
	IonCard,
	IonCol,
	IonGrid,
	IonIcon,
	IonItem,
	IonItemDivider,
	IonLabel,
	IonList,
	IonRow,
	IonSegment,
	IonSegmentButton,
} from '@ionic/angular/standalone';
import { SneatUserService } from '@sneat/auth-core';
import { IUserSpaceBrief } from '@sneat/auth-models';
import { ContactTitlePipe } from '@sneat/components';
import {
	ContactService,
	IUpdateContactRequest,
} from '@sneat/contactus-services';
import { IIdAndBrief, IIdAndBriefAndOptionalDbo } from '@sneat/core';
import {
	ContactType,
	Gender,
	IContactBrief,
	IContactDbo,
	IContactContext,
} from '@sneat/contactus-core';
import {
	getRelatedItemByKey,
	IRelatedItem,
	IRelationshipRoles,
	ISpaceModuleItemRef,
} from '@sneat/dto';
import { SpaceNavService } from '@sneat/space-services';
import { SneatBaseComponent } from '@sneat/ui';
import { MemberPages } from '../../constants';
import { UserSpaceBriefProvider } from '../../providers/user-space-brief.provider';
import { ContactContactsComponent } from '../contact-contacts';
import { ContactDobComponent } from '../contact-dob';
import { ContactLocationsComponent } from '../contact-locations';
import { ContactModulesMenuComponent } from '../contact-modules-menu';
import { ContactRolesInputModule } from '../contact-roles-input';
import {
	GenderFormComponent,
	RelationshipFormComponent,
} from '../contact-forms';
import { RelatedContactComponent } from './related-contact.component';

@Component({
	imports: [
		ContactDobComponent,
		ContactModulesMenuComponent,
		ContactContactsComponent,
		ContactRolesInputModule,
		ContactLocationsComponent,
		RelationshipFormComponent,
		GenderFormComponent,
		RelatedContactComponent,
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
		IonItemDivider,
		IonList,
		IonSegment,
		IonSegmentButton,
		FormsModule,
	],
	selector: 'sneat-contact-details',
	templateUrl: './contact-details.component.html',
})
export class ContactDetailsComponent
	extends SneatBaseComponent
	implements OnInit
{
	public readonly $contact = input.required<IContactContext | undefined>();
	protected readonly $space = computed(
		() => this.$contact()?.space || { id: '' },
	);
	protected readonly $spaceID = computed(() => this.$space()?.id);

	protected readonly $isMember = computed(
		() => !!this.$contact()?.brief?.roles?.includes('member'),
	);

	private readonly navController = inject(NavController);

	protected relatedContactsOfCurrentSpace?: readonly IIdAndBrief<IRelatedItem>[];

	protected get contactWithBriefAndOptionalDto():
		| IIdAndBriefAndOptionalDbo<IContactBrief, IContactDbo>
		| undefined {
		const contact = this.$contact();
		return contact?.brief
			? (contact as IIdAndBriefAndOptionalDbo<IContactBrief, IContactDbo>)
			: undefined;
	}

	protected tab: 'communicationChannels' | 'roles' | 'peers' | 'locations' =
		'peers';

	private readonly userService = inject(SneatUserService);
	private readonly spaceNavService = inject(SpaceNavService);
	private readonly contactService = inject(ContactService);

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

	protected readonly $relatedToContactOfCurrentUser = computed<
		ISpaceModuleItemRef | undefined
	>(() => {
		const userContactID = this.userSpaceBrief.$userContactID();
		return userContactID
			? {
					space: this.$spaceID() || '',
					module: 'contactus',
					collection: 'contacts',
					itemID: userContactID,
				}
			: undefined;
	});

	public ngOnInit(): void {
		console.log('ContactDetailsComponent ngOnInit');
	}

	protected readonly $rolesOfItem = computed(() => {
		const spaceID = this.$spaceID();
		const contact = this.$contact();
		const userContactID = this.userSpaceBrief.$userContactID();
		if (!contact || !userContactID || !spaceID) {
			return undefined;
		}
		const relatedContact = getRelatedItemByKey(
			contact.dbo?.related,
			'contactus',
			'contacts',
			spaceID,
			userContactID,
		);
		return relatedContact?.rolesOfItem;
	});

	protected readonly $firstRelatedAs = computed<string | undefined>(() => {
		const relationshipIDs = Object.keys(this.$rolesOfItem() || {});
		return relationshipIDs.length > 0 ? relationshipIDs[0] : undefined;
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

	protected get relatedContacts(): readonly IIdAndBrief<IRelatedItem>[] {
		return []; //zipMapBriefsWithIDs(this.contact?.dto?.related);
	}

	protected goMember(id: string): void {
		const space = this.$space();
		if (!space) {
			throw new Error('Can not navigate to member without team context');
		}
		this.spaceNavService.navigateToMember(this.navController, {
			id,
			space,
		});
	}

	protected addRelatedContact(event: Event): void {
		event.stopPropagation();
		alert('Not implemented yet');
	}

	protected goMemberPage(page: MemberPages): void {
		const contact = this.$contact();
		if (!contact) {
			throw new Error('this.$contact() is not set');
		}
		this.navController
			.navigateForward([page], {
				queryParams: { id: contact.id },
				state: { contact, space: this.$space() },
			})
			.catch(this.errorLogger.logError);
	}

	protected onRelatedAsChanged(relatedAs: IRelationshipRoles): void {
		console.log('onRelatedAsChanged()', relatedAs);

		const userContactID = this.userSpaceBrief.$userContactID();
		if (!userContactID) {
			throw new Error('onRelatedAsChanged() - userContactID is not set');
		}

		const relationshipIDs = Object.keys(relatedAs);

		const request: IUpdateContactRequest = {
			...this.newUpdateContactRequest(),
			related: [
				{
					itemRef: {
						space: this.$spaceID() || '',
						module: 'contactus',
						collection: 'contacts',
						itemID: userContactID,
					},
					add: {
						rolesOfItem: relationshipIDs,
					},
				},
			],
		};
		this.contactService.updateContact(request).subscribe({
			next: () => {
				console.log('onRelatedAsChanged() - contact updated');
			},
			error: this.errorLogger.logErrorHandler('Failed to update contact'),
		});
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

	changeGender(event: Event): void {
		const gender = (event as CustomEvent).detail.value as Gender;
		console.debug(`CommuneMemberPageComponent.changeGender(${gender})`);

		// this.startCommuneReadwriteTx([CommuneKind, MemberKind], (tx, communeDto) =>
		// 	this.membersService.changeMemberPrimaryField(tx, this.memberId, { name: 'gender', value: gender }, communeDto))
		// 	.subscribe({
		// 		next: memberDto => {
		// 			this.setMemberInfo(newCommuneMemberInfo(memberDto));
		// 			this.setMemberDto(memberDto);
		// 		},
		// 		error: this.params.errorLogger.logErrorHandler('Failed to set member gender'),
		// 	});
	}
}
