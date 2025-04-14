import { SpaceMemberType } from '@sneat/auth-models';
import { ContactusModuleBaseComponent } from '@sneat/contactus-shared';
import { IIdAndBriefAndOptionalDbo, SpaceType } from '@sneat/core';
import { isSpaceSupportsMemberGroups } from '@sneat/dto';
import {
	ContactusSpaceService,
	MemberService,
} from '@sneat/contactus-services';
import { IContactBrief, IContactDbo } from '@sneat/contactus-core';

export abstract class MembersBasePage extends ContactusModuleBaseComponent {
	public members?: readonly IIdAndBriefAndOptionalDbo<
		IContactBrief,
		IContactDbo
	>[];

	// protected currentUserDto: IDtoUser;

	abstract get memberType(): SpaceMemberType;

	// protected setCurrentUser(dto: IDtoUser) {
	//     this.currentUserDto = dto;
	// }

	protected constructor(
		className: string,
		contactusTeamService: ContactusSpaceService,
		protected membersService: MemberService,
	) {
		super(className, contactusTeamService);
		// this.userService.currentUserLoaded.subscribe(user => this.setCurrentUser(user));
	}

	goNewMember = () => {
		// TODO: use it?
		this.navigateForwardToSpacePage('new-member').catch(
			this.logErrorHandler('failed to navigate to new member page'),
		);
	};

	// goMember = (member: IMemberContext, page?: MemberPages) => {
	// 	this.navigateForwardToSpacePage(
	// 		(page || 'member') + '/' + member.id,
	// 	).catch(this.logErrorHandler('failed to navigate to team member page'));
	// };
	//
	// goContact = (id: string, event: Event) => {
	// 	event.stopPropagation();
	// 	this.navigateForwardToSpacePage(`contact/${id}`)
	// 		.catch(this.logErrorHandler('failed to navigate to contact page'));
	// };

	public get supportsMemberGroups(): boolean {
		return (
			!!this.space?.brief && isSpaceSupportsMemberGroups(this.space.brief.type)
		);
	}

	// protected setPageCommuneIds(source: string, communeIds: ICommuneIds, communeDto?: ICommuneDto): void {
	// 	super.setPageCommuneIds(source, communeIds, communeDto);
	// 	if (this.communeRealId) {
	// 		this.membersService.selectByType(this.communeRealId, this.memberType)
	// 			.subscribe(
	// 				members => {
	// 					this.members = members;
	// 				},
	// 				this.errorLogger.logError,
	// 			);
	// 	}
	// }
}
