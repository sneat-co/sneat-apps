import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Params } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SpaceMemberType } from '@sneat/auth-models';
import {
	ContactusServicesModule,
	ContactusSpaceService,
	MemberGroupService,
	MemberService,
} from '@sneat/contactus-services';
import { FamilyMembersComponent, MemberGroup } from '@sneat/contactus-shared';
import { IMemberGroupContext } from '@sneat/contactus-core';
import { isSpaceSupportsMemberGroups } from '@sneat/dto';
import {
	SpaceComponentBaseParams,
	SpacePageTitleComponent,
} from '@sneat/space-components';
import { SpaceServiceModule } from '@sneat/space-services';
import { MembersBasePage } from '../../members-base-page';
import { Component } from '@angular/core';

@Component({
	selector: 'sneat-members-page',
	templateUrl: 'members-page.component.html',
	providers: [SpaceComponentBaseParams],
	imports: [
		IonicModule,
		CommonModule,
		FormsModule,
		SpacePageTitleComponent,
		ContactusServicesModule,
		FamilyMembersComponent,
		SpaceServiceModule,
	],
})
export class MembersPageComponent extends MembersBasePage {
	public memberGroups?: readonly IMemberGroupContext[];
	// public loadingStubs?: number[];
	public segment: 'all' | 'groups' = 'all';
	// public listMode: 'list' | 'cards' = 'list';
	// public membersByGroupId: { [id: string]: IMemberContext[] } = {};

	readonly memberType: SpaceMemberType = 'member';

	constructor(
		memberService: MemberService,
		contactusTeamService: ContactusSpaceService,
		private readonly memberGroupService: MemberGroupService,
	) {
		super('MembersPageComponent', contactusTeamService, memberService);
	}

	protected goGroup(memberGroup: IMemberGroupContext): void {
		this.navigateForwardToSpacePage(`group/${memberGroup.id}`, {
			state: { memberGroup },
		}).catch(this.logErrorHandler('failed to navigate to members group page'));
	}

	protected goNewMemberPage(group?: MemberGroup): void {
		const queryParams: Params | undefined = group
			? { group: group.id }
			: undefined;
		this.navigateForwardToSpacePage('new-member', {
			queryParams,
			state: { group },
		}).catch(
			this.logErrorHandler(
				'failed to navigate to new member page with age parameter',
			),
		);
	}

	public goNew(): void {
		switch (this.segment) {
			case 'all':
				this.goNewMemberPage();
				break;
			case 'groups':
				this.navigateForwardToSpacePage('new-group').catch(
					this.logErrorHandler('failed to navigate to new group page'),
				);
				break;
			default:
				alert(`Unknown segment: ${this.segment}`);
				return;
		}
	}

	override onSpaceDboChanged(): void {
		super.onSpaceDboChanged();
		if (!this.space) {
			throw new Error('!this.commune');
		}
		console.log(`MembersPageComponent.onSpaceDboChanged()`);
		// if (this.team?.dto?.numberOf?.members) {
		// 	this.loadingStubs = Array(this.team?.dto?.numberOf?.members).fill(1);
		// }
		// if (!isNaN(this.prevMembersCount) && this.prevMembersCount != this.commune.numberOf.members) {
		//     this.loadData();
		// }
		this.loadData('onSpaceDboChanged');
		// this.prevMembersCount = this.team?.dto?.numberOf?.members || 0;
	}

	private loadData(source: string): void {
		console.log(`MembersPageComponent.loadData(source=${source})`);

		// this.unsubscribe();
		const space = this.space;
		if (!space) {
			throw new Error('!this.team');
		}
		// this.noGroupMembers = this.team?.brief && isTeamSupportsMemberGroups(this.team.brief.type) ? [] : undefined;

		// const contactusTeam = this.teamModuleDto;
		//
		// if (contactusTeam?.dto?.contacts) {
		// 	this.processContactusSpaceDbo(contactusTeam.dto);
		// } else {
		// 	this.contactService
		// 		.watchContactsWithRole(space, 'space_member') // TODO: use constant
		// 		.pipe(takeUntil(this.spaceIDChanged$))
		// 		.subscribe({
		// 			next: (members) => {
		// 				console.log(
		// 					`MembersPageComponent.loadData(source=${source}), members =>`,
		// 					members,
		// 				);
		// 				if (members?.length) {
		// 					// TODO: deep equal
		// 					members.forEach((m) => {
		// 						if (m.id) {
		// 							if (m.dto?.related) {
		// 								// this.contactsByMember[m.id] = zipMapBriefsWithIDs(
		// 								// 	m.dto.relatedContacts,
		// 								// );
		// 							} else if (this.contactsByMember[m.id]) {
		// 								delete this.contactsByMember[m.id];
		// 							}
		// 						}
		// 					});
		// 					this.members = members;
		// 					this.processMembers();
		// 				}
		// 			},
		// 		});
		// }

		if (space.type && isSpaceSupportsMemberGroups(space.type)) {
			throw new Error('not implemented yet due to refactoring');
			// this.contactService.watchContactsByRole(team)
			// 	.subscribe(memberGroups => {
			// 		if (memberGroups && (!this.memberGroups || memberGroups.length !== this.memberGroups.length)) { // TODO: deep equal
			// 			this.memberGroups = memberGroups;
			// 		}
			// 	});
		}
	}
}
