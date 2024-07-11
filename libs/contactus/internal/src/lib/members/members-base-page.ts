import { ActivatedRoute } from '@angular/router';
import { TeamMemberType } from '@sneat/auth-models';
import { ContactusModuleBaseComponent } from '@sneat/contactus-shared';
import { IIdAndBriefAndOptionalDto, SpaceType } from '@sneat/core';
import { isTeamSupportsMemberGroups } from '@sneat/dto';
import { TeamComponentBaseParams } from '@sneat/team-components';
import { ContactusTeamService, MemberService } from '@sneat/contactus-services';
import { IContactBrief, IContactDto } from '@sneat/contactus-core';

export abstract class MembersBasePage extends ContactusModuleBaseComponent {
	public members?: readonly IIdAndBriefAndOptionalDto<
		IContactBrief,
		IContactDto
	>[];

	// protected currentUserDto: IDtoUser;

	abstract get memberType(): TeamMemberType;

	// protected setCurrentUser(dto: IDtoUser) {
	//     this.currentUserDto = dto;
	// }

	protected constructor(
		className: string,
		route: ActivatedRoute,
		params: TeamComponentBaseParams,
		contactusTeamService: ContactusTeamService,
		protected membersService: MemberService,
	) {
		super(className, route, params, contactusTeamService);
		// this.userService.currentUserLoaded.subscribe(user => this.setCurrentUser(user));
	}

	goNewMember = () => {
		// TODO: use it?
		this.navigateForwardToTeamPage('new-member').catch(
			this.logErrorHandler('failed to navigate to new member page'),
		);
	};

	// goMember = (member: IMemberContext, page?: MemberPages) => {
	// 	this.navigateForwardToTeamPage(
	// 		(page || 'member') + '/' + member.id,
	// 	).catch(this.logErrorHandler('failed to navigate to team member page'));
	// };
	//
	// goContact = (id: string, event: Event) => {
	// 	event.stopPropagation();
	// 	this.navigateForwardToTeamPage(`contact/${id}`)
	// 		.catch(this.logErrorHandler('failed to navigate to contact page'));
	// };

	// ngAfterViewInit(): void {
	// 	this.preloader.preload([
	// 		'member',
	// 		'member-new',
	// 		'commune-overview',
	// 	]);
	// 	this.onTeamIdChanged();
	// }

	// override onTeamIdChanged(): void {
	// 	super.onTeamIdChanged();
	// 	// this.membersService.
	// }

	public get supportsMemberGroups(): boolean {
		return (
			!!this.space?.brief && isTeamSupportsMemberGroups(this.space.brief.type)
		);
	}

	public get teamType(): SpaceType | undefined {
		return this.space?.brief?.type;
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
