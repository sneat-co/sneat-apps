import { CommonModule } from "@angular/common";
import { AfterViewInit, Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { IonicModule } from "@ionic/angular";
import { SneatPipesModule } from "@sneat/components";
import { ContactComponentBaseParams, ContactDetailsComponent } from "@sneat/contactus-shared";
import {  MemberRelationship } from "@sneat/dto";
import { MemberComponentBaseParams } from "../../member-component-base-params";
import { MemberBasePage } from "../member-base-page";

@Component({
	selector: "sneat-team-member-page",
	templateUrl: "./team-member-page.component.html",
	providers: [
		MemberComponentBaseParams,
		ContactComponentBaseParams,
	],
	standalone: true,
	imports: [
		CommonModule,
		FormsModule,
		IonicModule,
		SneatPipesModule,
		ContactDetailsComponent,
	],
})
export class TeamMemberPageComponent extends MemberBasePage implements AfterViewInit {

	public relatedAs?: MemberRelationship;

	constructor(
		route: ActivatedRoute,
		params: MemberComponentBaseParams,
	) {
		super("TeamMemberPageComponent", route, params);
	}

	ngAfterViewInit(): void {
		this.preloader.preload([ // TODO: implement preloader
			"members",
			"document",
			"document-new",
			"contact",
			"contact-new",
			"sizes",
		]);
	}



	// protected setMemberId(memberId: string): void {
	// 	super.setMemberId(memberId);
	// 	if (this.currentUserDto && this.communeRealId) {
	// 		this.setRelatedAs();
	// 	}
	// }

	// protected setPageCommuneIds(source: string, communeIds: ICommuneIds, communeDto?: ICommuneDto): void {
	// 	super.setPageCommuneIds(source, communeIds, communeDto);
	// 	if (this.currentUserDto && this.memberId) {
	// 		this.setRelatedAs();
	// 	}
	// }

	// protected setCurrentUser(dto: IUserDto): void {
	// 	super.setCurrentUser(dto);
	// 	this.logger.debug('CommuneMemberPage.setCurrentUser()', dto);
	// 	if (this.memberId && this.communeRealId) {
	// 		this.setRelatedAs();
	// 	}
	// }

	public removeMember() {
		if (
			!confirm(
				`Are you sure you want to remove ${
					this.member?.brief?.title || this.member?.id
				} from ${this.team?.brief?.title}?`,
			)
		) {
			return;
		}
		if (!this.team) {
			this.errorLogger.logError(
				"Can not remove team member without team context",
			);
			return;
		}
		if (!this.member?.id) {
			this.errorLogger.logError(
				"Can not remove team member without knowing member ID",
			);
			return;
		}
		this.contactService.removeTeamMember(this.team.id, this.member?.id).subscribe({
			next: () => {
				this.navController
					.pop()
					.catch((err) =>
						this.errorLogger.logError(err, "Failed to pop navigator state"),
					);
			},
			error: (err) => this.errorLogger.logError(err, "Failed to remove member"),
		});
	}

	private setRelatedAs(): void {
		// this.logger.debug('CommuneMemberPage.setRelatedAs()', this.currentUserDto);
		// if (!this.currentUserDto) {
		// 	return;
		// }
		// const userCommunes = this.currentUserDto && this.currentUserDto.communes;
		// if (userCommunes) {
		// 	const userCommuneInfo = userCommunes.find(c => eq(c.id, this.communeRealId));
		// 	if (userCommuneInfo && userCommuneInfo.members) {
		// 		const memberInfo = userCommuneInfo.members[this.memberId];
		// 		if (memberInfo) {
		// 			this.relatedAs = memberInfo.relatedAs;
		// 		}
		// 	}
		// }
	}

}
