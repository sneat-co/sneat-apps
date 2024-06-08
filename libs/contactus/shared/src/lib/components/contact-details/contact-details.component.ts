import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IUserTeamBrief } from '@sneat/auth-models';
import { SneatPipesModule } from '@sneat/components';
import { IUpdateContactRequest } from '@sneat/contactus-services';
import { IIdAndBrief, IIdAndBriefAndOptionalDto } from '@sneat/core';
import {
	ContactType,
	Gender,
	IContactBrief,
	IContactDto,
	IContactContext,
} from '@sneat/contactus-core';
import {
	getRelatedItemByKey,
	IRelatedItem,
	IRelationshipRoles,
	ITeamModuleDocRef,
} from '@sneat/dto';
import { ITeamRef } from '@sneat/team-models';
import { MemberPages } from '../../constants';
import { ContactComponentBaseParams } from '../../contact-component-base-params';
import { ContactContactsComponent } from '../contact-contacts';
import { ContactDobComponent } from '../contact-dob';
import { ContactLocationsComponent } from '../contact-locations';
import { ContactModulesMenuComponent } from '../contact-modules-menu';
import { ContactRelatedAsComponent } from '../contact-related-as';
import { ContactRolesInputModule } from '../contact-roles-input';
import { ContactsListModule } from '../contacts-list';
import {
	GenderFormComponent,
	PersonWizardComponent,
	RelationshipFormComponent,
} from '../person-form';
import { RelatedContactComponent } from './related-contact.component';

@Component({
	selector: 'sneat-contact-details',
	templateUrl: './contact-details.component.html',
	standalone: true,
	imports: [
		CommonModule,
		IonicModule,
		FormsModule,
		SneatPipesModule,
		ContactDobComponent,
		ContactRelatedAsComponent,
		ContactModulesMenuComponent,
		ContactContactsComponent,
		ContactRolesInputModule,
		ContactsListModule,
		RouterLink,
		ContactLocationsComponent,
		PersonWizardComponent,
		RelationshipFormComponent,
		GenderFormComponent,
		RelatedContactComponent,
	],
})
export class ContactDetailsComponent implements OnChanges {
	@Input({ required: true }) public team?: ITeamRef;
	@Input({ required: true }) public contact?: IContactContext;

	protected relatedContactsOfCurrentTeam?: readonly IIdAndBrief<IRelatedItem>[];

	private userTeamBriefs?: Record<string, IUserTeamBrief>;
	private userContactID?: string;

	protected get contactWithBriefAndOptionalDto():
		| IIdAndBriefAndOptionalDto<IContactBrief, IContactDto>
		| undefined {
		return this.contact?.brief
			? (this.contact as IIdAndBriefAndOptionalDto<IContactBrief, IContactDto>)
			: undefined;
	}

	protected rolesOfItem?: IRelationshipRoles;

	protected firstRelatedAs?: string;

	protected tab: 'communicationChannels' | 'roles' | 'peers' | 'locations' =
		'peers';

	protected relatedToContactOfCurrentUser?: ITeamModuleDocRef;

	constructor(private readonly params: ContactComponentBaseParams) {
		params.userService.userState.subscribe({
			next: (userState) => {
				this.userTeamBriefs = userState?.record?.teams;
				this.setUserContactID();
			},
		});
		params.userService.userState.subscribe({
			next: (state) => {
				this.userTeamBriefs = state?.record?.teams;
				this.setUserContactID();
			},
		});
	}

	private setRelatedToCurrentUser(): void {
		this.relatedToContactOfCurrentUser = this.userContactID
			? {
					teamID: this.team?.id || '',
					moduleID: 'contactus',
					collection: 'contacts',
					itemID: this.userContactID,
				}
			: undefined;
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['team']) {
			this.setUserContactID();
			this.setRelatedToCurrentUser();
		}
		if (changes['contact']) {
			console.log(
				'ContactDetailsComponent.ngOnChanges(): contact changed:',
				changes['contact'],
			);
			const teamID = this.team?.id;
			if (teamID && this.contact?.dbo?.related) {
				const contactus = this.contact.dbo.related['contactus'];
				if (!contactus) {
					return;
				}
				const contacts = contactus['contacts'];
				if (!contacts) {
					return;
				}
				throw new Error('Not implemented yet');
				// this.relatedContactsOfCurrentTeam = zipMapBriefsWithIDs(contacts);
			}
		}
	}

	private setUserContactID(): void {
		const userContactID =
			this.userTeamBriefs?.[this.team?.id || '']?.userContactID;
		if (userContactID != this.userContactID) {
			this.userContactID = userContactID;
			this.onUserContactIDChanged();
		}
	}

	private onUserContactIDChanged(): void {
		this.setRelatedToCurrentUser();
		if (this.userContactID && this.team?.id) {
			this.setRelatedAs(this.team.id, this.userContactID);
		}
	}

	private setRelatedAs(teamID: string, userContactID: string): void {
		const relatedContact = getRelatedItemByKey(
			this.contact?.dbo?.related,
			'contactus',
			'contacts',
			teamID,
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
		const team = this.team;
		if (!team) {
			throw new Error('Can not navigate to member without team context');
		}
		this.params.teamNavService.navigateToMember(this.params.navController, {
			id,
			team,
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
		this.params.navController
			.navigateForward([page], {
				queryParams: { id: this.contact.id },
				state: { contact: this.contact, team: this.team },
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
			relatedTo: {
				teamID: this.team?.id || '',
				moduleID: 'contactus',
				collection: 'contacts',
				itemID: userContactID,
				add: {
					rolesOfItem: relationshipIDs,
				},
			},
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
		const teamID = this.team?.id;
		if (!contactID || !teamID) {
			throw new Error(
				'ContactDetailsComponent.newUpdateContactRequest() - contactID or teamID is not set',
			);
		}
		return { teamID, contactID };
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
