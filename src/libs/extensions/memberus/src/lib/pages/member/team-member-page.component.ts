//tslint:disable:no-unsafe-any
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Gender, MemberRelationship } from '@sneat/dto';
import { TeamComponentBaseParams, TeamPageContextComponent } from '@sneat/team/components';
// import { MemberRelationship } from 'sneat-shared/models/dto/dto-member';
// import { CommuneBasePageParams } from 'sneat-shared/services/params';
import { MemberBasePage } from '../member-base-page';
import { MemberComponentBaseParams } from '../member-context.component';

@Component({
	selector: 'sneat-team-member-page',
	templateUrl: './team-member-page.component.html',
	providers: [
		TeamComponentBaseParams,
		MemberComponentBaseParams,
	],
})
export class TeamMemberPageComponent extends MemberBasePage implements OnInit, AfterViewInit {

	@ViewChild('teamPageContext')
	public teamPageContext?: TeamPageContextComponent;

	public dob?: string;
	public relatedAs?: MemberRelationship;

	constructor(
		params: MemberComponentBaseParams,
	) {
		super(params);
	}

	ngAfterViewInit(): void {
		this.setTeamPageContext(this.teamPageContext);
		this.teamParams.preloader.preload([ // TODO: implement preloader
			'members',
			'document',
			'document-new',
			'contact',
			'contact-new',
			'sizes',
		]);
	}

	changeGender(event: Event): void {
		// tslint:disable-next-line:no-any
		const gender = (event as CustomEvent).detail.value as Gender;
		this.logger.debug(`CommuneMemberPageComponent.changeGender(${gender})`);

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

	changeRelationship(event: Event): void {
		const relatedAs = (event as CustomEvent).detail.value as MemberRelationship;
		// TODO: move below to some service
		if (!this.currentUserId) {
			throw new Error('!this.currentUserId');
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
