import { CommonModule } from '@angular/common';
import {
	Component,
	inject,
	Input,
	OnChanges,
	SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController } from '@ionic/angular';
import { IUserSpaceBrief } from '@sneat/auth-models';
import { ContactTitlePipe } from '@sneat/components';
import { IUpdateContactRequest } from '@sneat/contactus-services';
import { IIdAndBrief, IIdAndBriefAndOptionalDbo, SpaceType } from '@sneat/core';
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
import { ISpaceRef } from '@sneat/core';
import { MemberPages } from '../../constants';
import { ContactComponentBaseParams } from '../../contact-component-base-params';
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
	selector: 'sneat-contact-details',
	templateUrl: './contact-details.component.html',
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		ContactDobComponent,
		ContactModulesMenuComponent,
		ContactContactsComponent,
		ContactRolesInputModule,
		ContactLocationsComponent,
		RelationshipFormComponent,
		GenderFormComponent,
		RelatedContactComponent,
		ContactTitlePipe,
	],
})
export class ContactDetailsComponent implements OnChanges {
	@Input({ required: true }) public space: ISpaceRef = {
		id: '',
		type: '' as SpaceType,
	};
	@Input({ required: true }) public contact?: IContactContext;

	private readonly navController = inject(NavController);

	protected relatedContactsOfCurrentSpace?: readonly IIdAndBrief<IRelatedItem>[];

	private userSpaceBriefs?: Record<string, IUserSpaceBrief>;
	private userContactID?: string;

	protected get contactWithBriefAndOptionalDto():
		| IIdAndBriefAndOptionalDbo<IContactBrief, IContactDbo>
		| undefined {
		return this.contact?.brief
			? (this.contact as IIdAndBriefAndOptionalDbo<IContactBrief, IContactDbo>)
			: undefined;
	}

	protected rolesOfItem?: IRelationshipRoles;

	protected firstRelatedAs?: string;

	protected tab: 'communicationChannels' | 'roles' | 'peers' | 'locations' =
		'peers';

	protected relatedToContactOfCurrentUser?: ISpaceModuleItemRef;

	constructor(private readonly params: ContactComponentBaseParams) {
		params.userService.userState.subscribe({
			next: (userState) => {
				this.userSpaceBriefs = userState?.record?.spaces;
				this.setUserContactID();
			},
		});
		params.userService.userState.subscribe({
			next: (state) => {
				this.userSpaceBriefs = state?.record?.spaces;
				this.setUserContactID();
			},
		});
	}

	private setRelatedToCurrentUser(): void {
		this.relatedToContactOfCurrentUser = this.userContactID
			? {
					space: this.space?.id || '',
					module: 'contactus',
					collection: 'contacts',
					itemID: this.userContactID,
				}
			: undefined;
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['space']) {
			this.setUserContactID();
			this.setRelatedToCurrentUser();
		}
		// if (changes['contact']) {
		// 	console.log(
		// 		'ContactDetailsComponent.ngOnChanges(): contact changed:',
		// 		changes['contact'],
		// 	);
		// 	const spaceID = this.team?.id;
		// 	if (spaceID && this.contact?.dbo?.related) {
		// 		const contactus = this.contact.dbo.related['contactus'];
		// 		if (!contactus) {
		// 			return;
		// 		}
		// 		const contacts = contactus['contacts'];
		// 		if (!contacts) {
		// 			return;
		// 		}
		// 		// throw new Error('Not implemented yet');
		// 		// this.relatedContactsOfCurrentTeam = zipMapBriefsWithIDs(contacts);
		// 	}
		// }
	}

	private setUserContactID(): void {
		const userContactID =
			this.userSpaceBriefs?.[this.space?.id || '']?.userContactID;
		if (userContactID != this.userContactID) {
			this.userContactID = userContactID;
			this.onUserContactIDChanged();
		}
	}

	private onUserContactIDChanged(): void {
		this.setRelatedToCurrentUser();
		if (this.userContactID && this.space?.id) {
			this.setRelatedAs(this.space.id, this.userContactID);
		}
	}

	private setRelatedAs(spaceID: string, userContactID: string): void {
		const relatedContact = getRelatedItemByKey(
			this.contact?.dbo?.related,
			'contactus',
			'contacts',
			spaceID,
			userContactID,
		);
		this.rolesOfItem = relatedContact?.rolesOfItem;
		const relationshipIDs = Object.keys(this.rolesOfItem || {});
		this.firstRelatedAs =
			relationshipIDs.length > 0 ? relationshipIDs[0] : undefined;
		console.log(
			'userContactID',
			userContactID,
			'rolesOfItem',
			this.rolesOfItem,
			'contact',
			this.contact,
		);
	}

	// private setRelatedAs(): void {
	// 	console.log('setRelatedAs() - not implemented yet');
	// }

	protected get currentUserID() {
		return this.params.userService.currentUserID;
	}

	protected hideForContactTypes(contactTypes: ContactType[]): boolean {
		return (
			!!this.contact?.brief?.type &&
			!contactTypes.includes(this.contact.brief.type)
		);
	}

	protected get currentUserId() {
		return this.params.userService.currentUserID;
	}

	protected get relatedContacts(): readonly IIdAndBrief<IRelatedItem>[] {
		return []; //zipMapBriefsWithIDs(this.contact?.dto?.related);
	}

	protected goMember(id: string): void {
		const space = this.space;
		if (!space) {
			throw new Error('Can not navigate to member without team context');
		}
		this.params.spaceNavService.navigateToMember(this.navController, {
			id,
			space,
		});
	}

	protected addRelatedContact(event: Event): void {
		event.stopPropagation();
		alert('Not implemented yet');
	}

	protected goMemberPage(page: MemberPages): void {
		if (!this.contact) {
			throw new Error('this.contact');
		}
		this.navController
			.navigateForward([page], {
				queryParams: { id: this.contact.id },
				state: { contact: this.contact, space: this.space },
			})
			.catch(this.params.errorLogger.logError);
	}

	protected onRelatedAsChanged(relatedAs: IRelationshipRoles): void {
		console.log('onRelatedAsChanged()', relatedAs);

		const userContactID = this.userContactID;
		if (!userContactID) {
			throw new Error('onRelatedAsChanged() - userContactID is not set');
		}

		const relationshipIDs = Object.keys(relatedAs);

		const request: IUpdateContactRequest = {
			...this.newUpdateContactRequest(),
			related: [
				{
					itemRef: {
						space: this.space?.id || '',
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
		this.params.contactService.updateContact(request).subscribe({
			next: () => {
				console.log('onRelatedAsChanged() - contact updated');
			},
			error: this.params.errorLogger.logErrorHandler(
				'Failed to update contact',
			),
		});
	}

	private newUpdateContactRequest(): IUpdateContactRequest {
		const contactID = this.contact?.id;
		const spaceID = this.space?.id;
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
