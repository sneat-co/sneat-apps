import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterLink } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { SneatPipesModule } from "@sneat/components";
import { Gender, IBriefAndID, IContactBrief, MemberRelationship } from "@sneat/dto";
import { IContactContext, ITeamContext, zipMapBriefsWithIDs } from "@sneat/team/models";
import { MemberPages } from "../../constants";
import { ContactComponentBaseParams } from "../../contact-component-base-params";
import { ContactContactsComponent } from "../contact-contacts";
import { ContactDobComponent } from "../contact-dob";
import { ContactLocationsComponent } from "../contact-locations";
import { ContactModulesMenuComponent } from "../contact-modules-menu";
import { ContactRelatedAsComponent } from "../contact-related-as";
import { ContactRolesInputModule } from "../contact-roles-input";
import { ContactsListModule } from "../contacts-list";

@Component({
	selector: "sneat-contact-details",
	templateUrl: "./contact-details.component.html",
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
	],
})
export class ContactDetailsComponent {
	@Input({ required: true }) public team?: ITeamContext;
	@Input({ required: true }) public contact?: IContactContext;

	protected relatedAs?: MemberRelationship;

	constructor(
		private readonly params: ContactComponentBaseParams,
	) {

	}

	public get currentUserId() {
		return this.params.userService.currentUserID;
	}

	protected get relatedContacts(): readonly IBriefAndID<IContactBrief>[] {
		return zipMapBriefsWithIDs(this.contact?.dto?.relatedContacts);
	}

	protected goMember(id: string): void {
		const team = this.team;
		if (!team) {
			throw new Error('Can not navigate to member without team context');
		}
		this.params.teamNavService.navigateToMember(this.params.navController, { id, team });
	}

	protected addRelatedContact(event: Event): void {
		event.stopPropagation();
		alert('Not implemented yet');
	}


	protected goMemberPage(page: MemberPages): void {
		if (!this.contact) {
			throw new Error("this.contact");
		}
		this.params.navController.navigateForward([page], {
			queryParams: { id: this.contact.id },
			state: { contact: this.contact, team: this.team },
		}).catch(this.params.errorLogger.logError);
	}

	protected changeRelationship(event: Event): void {
		const relatedAs = (event as CustomEvent).detail.value as MemberRelationship;
		console.log("changeRelationship", relatedAs);
		// TODO: move below to some service
		if (!this.currentUserId) {
			throw new Error("!this.currentUserId");
		}
		// this.userService.updateRecord(undefined, this.currentUserId, dto => {
		// 	const communeId = this.communeRealId;
		// 	const userCommuneInfo = dto.communes && dto.communes.find(commune => eq(commune.id, communeId));
		// 	if (!userCommuneInfo) {
		// 		alert('You are not a member of this commune');
		// 		return { dto, changed: false };
		// 	}
		// 	if (!userCommuneInfo.members) {
		// 		userCommuneInfo.members = {};
		// 	}
		// 	if (userCommuneInfo.members[this.memberId]) {
		// 		userCommuneInfo.members[this.memberId].relatedAs = relatedAs;
		// 	} else {
		// 		userCommuneInfo.members[this.memberId] = { relatedAs };
		// 	}
		// 	return { dto, changed: true };
		// })
		// 	.subscribe(user => {
		// 		this.relatedAs = relatedAs;
		// 		this.currentUserDto = user;
		// 	});
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
