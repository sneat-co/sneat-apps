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
	IRelatedContact,
} from '@sneat/dto';
import {
	IContactContext,
	ITeamRef,
	zipMapBriefsWithIDs,
} from '@sneat/team-models';
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
	],
})
export class ContactDetailsComponent implements OnChanges {
	@Input({ required: true }) public team?: ITeamRef;
	@Input({ required: true }) public contact?: IContactContext;

	private userTeamBriefs?: { [id: string]: IUserTeamBrief };
	private currentUserContactID?: string;

	protected get contactWithBriefAndOptionalDto():
		| IIdAndBriefAndOptionalDto<IContactBrief, IContactDto>
		| undefined {
		return this.contact?.brief
			? (this.contact as IIdAndBriefAndOptionalDto<IContactBrief, IContactDto>)
			: undefined;
	}

	protected relatedAs?: string;

	protected tab: 'communicationChannels' | 'roles' | 'peers' | 'locations' =
		'peers';

	constructor(private readonly params: ContactComponentBaseParams) {
		params.userService.userState.subscribe({
			next: (state) => {
				this.userTeamBriefs = state?.record?.teams;
				this.setCurrentUserContactID();
			},
		});
	}

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['team']) {
			this.setCurrentUserContactID();
		}
	}

	private setCurrentUserContactID(): void {
		if (!this.team?.id || !this.userTeamBriefs) {
			this.currentUserContactID = undefined;
			return;
		}
		const userTeamBrief = this.userTeamBriefs[this.team.id];
		if (!userTeamBrief) {
			this.currentUserContactID = undefined;
			return;
		}
		const { userContactID } = userTeamBrief;
		this.currentUserContactID = userContactID;
		const relatedContacts = this.contact?.dto?.relatedContacts;
		if (relatedContacts) {
			const relatedContact = relatedContacts[userContactID];
			const relations = relatedContact?.relatedAs
				? Object.keys(relatedContact.relatedAs)
				: [];
			this.relatedAs = relations.length ? relations[0] : undefined;
		}
		console.log(
			'userContactID',
			userContactID,
			'relatedAs',
			this.relatedAs,
			'contact',
			this.contact,
		);
	}

	private setRelatedAs(): void {}

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

	protected get relatedContacts(): readonly IIdAndBrief<IRelatedContact>[] {
		return zipMapBriefsWithIDs(this.contact?.dto?.relatedContacts);
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

	protected onRelatedAsChanged(relatedAs: string): void {
		console.log('onRelatedAsChanged()', relatedAs);

		const userContactID = this.currentUserContactID;
		if (!userContactID) {
			throw new Error('onRelatedAsChanged() - userContactID is not set');
		}

		const request: IUpdateContactRequest = {
			...this.newUpdateContactRequest(),
			relatedTo: {
				moduleID: 'contactus',
				itemID: userContactID,
				collection: 'contacts',
				relatedAs,
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
		// tslint:disable-next-line:no-any
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
