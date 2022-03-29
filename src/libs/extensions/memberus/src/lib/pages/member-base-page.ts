//tslint:disable:no-unsafe-any
import { Directive, OnInit } from '@angular/core';
import { TeamBasePageDirective } from '@sneat/team/components';
import { IMemberContext } from '@sneat/team/models';
import { MemberPages } from '../constants';
// import { MemberPages } from 'sneat-shared/extensions/memberus/constants';
// import { IMemberDto } from 'sneat-shared/models/dto/dto-member';
// import { IUserDto } from 'sneat-shared/models/dto/dto-user';
// import { eq } from 'sneat-shared/services/interfaces';
// import { ICommuneMemberInfo } from '../../../models/dto/dto-commune';
// import { CommuneTopPage } from '../../../pages/constants';
import { MemberComponentBaseParams } from './member-context.component';

@Directive()
export abstract class MemberBasePage extends TeamBasePageDirective implements OnInit {
	public segment: 'friends' | 'other' | 'summary' = 'summary';
	// override defaultBackUrl = CommuneTopPage.members;
	public isDeleted?: boolean;
	// protected currentUserDto: IUserDto | undefined;
	private memberContext?: IMemberContext;

	protected constructor(
		params: MemberComponentBaseParams,
		// protected preloader: NgModulePreloaderService,
		// protected assetService: IAssetService,
	) {
		super('members', params.teamPageParams);
	}

	public get member(): IMemberContext | undefined {
		return this.memberContext;
	}

	override ngOnInit(): void {
		super.ngOnInit();
		try {
			this.tryToGetMemberFromHistoryState();
			// this.userService.currentUserLoaded.subscribe(user => {
			// 	this.setCurrentUser(user);
			// });
			this.route?.params.subscribe(params => {
				const { memberId } = params;
				console.log('CommuneMemberPage() => queryParamMap', params, 'memberId:', memberId);
				// if (memberId && memberId !== this.memberId) {
				// 	this.setMemberId(memberId);
				// }
			});
		} catch (e) {
			this.teamParams.errorLogger.logError(e, 'Failed to initialize MemberBasePage');
		}
	}

	goNew = (event: Event, type: 'new-contact' | 'new-document' | 'new-liability' | 'new-asset', relation?: string): void => {
		// this.navigateForward(
		// 	type,
		// 	{ member: this.memberContext, relation },
		// 	{ memberDto: this.memberDto });
	};

	go(page: MemberPages): void {
		if (!this.memberContext) {
			throw new Error('this.memberContext');
		}
		this.navController.navigateForward([page], {
			queryParams: { id: this.memberContext.id },
			state: { member: this.memberContext, team: this.memberContext.team },
		})
			.catch(this.teamParams.errorLogger.logError);
	}

	// protected setCurrentUser(dto?: IUserDto): void {
	// 	this.currentUserDto = dto;
	// }

	// protected setMemberId(memberId: string): void {
	// 	console.log(`CommuneMemberPage.setMemberId(${memberId})`);
	// 	if (this.memberId === memberId) {
	// 		return;
	// 	}
	// 	this.memberId = memberId;
	// 	if (this.memberInfo && this.memberInfo.id !== memberId) {
	// 		this.memberInfo = undefined;
	// 	}
	// 	if (this.memberDto && this.memberDto.id !== memberId) {
	// 		this.memberDto = undefined;
	// 	}
	// 	this.subscriptions.push(
	// 		this.membersService.watchById(this.memberId)
	// 			.subscribe({
	// 				next: memberDto => {
	// 					console.log('Loaded memberDto:', memberDto);
	// 					this.setMemberDto(memberDto);
	// 					if (!memberDto) {
	// 						return;
	// 					}
	// 					if (!eq(memberDto.communeId, this.communeRealId)) {
	// 						this.setPageCommuneIds('MemberPage.memberFromObservable', { real: memberDto.communeId });
	// 					}
	// 				},
	// 				error: err => {
	// 					this.errorLogger.logError(err, 'Failed to get member by ID');
	// 				},
	// 			}));
	// }
	//
	// protected setMemberInfo(memberInfo: ICommuneMemberInfo): void {
	// 	this.memberInfo = memberInfo;
	// 	if (memberInfo && memberInfo.id && memberInfo.id !== this.memberId) {
	// 		this.setMemberId(memberInfo.id);
	// 	}
	// }
	//
	// protected onCommuneChanged(source?: string): void {
	// 	super.onCommuneChanged(source);
	// 	if (!this.commune) {
	// 		throw new Error('!this.commune');
	// 	}
	// 	if (!this.memberId && this.commune.dto.members) {
	// 		const memberInfo = this.commune.dto.members.find(m => !m.id);
	// 		if (memberInfo) {
	// 			this.setMemberInfo(memberInfo);
	// 		}
	// 	}
	// }

	// protected setMemberDto(memberDto?: IMemberDto): void {
	// 	console.log('setMemberDto', memberDto);
	// 	if (memberDto || this.memberDto) {
	// 		this.isDeleted = !!this.memberDto && !memberDto;
	// 	}
	// 	this.memberDto = memberDto;
	// 	if (!memberDto) {
	// 		return;
	// 	}
	// 	if (!this.memberInfo || !eq(this.memberInfo.id, memberDto.id)) {
	// 		this.setMemberInfo(newCommuneMemberInfo(memberDto));
	// 	}
	// 	if (memberDto.communeId && !eq(memberDto.communeId, this.communeRealId)) {
	// 		this.setPageCommuneIds('MemberPage.memberFromHistoryState', { real: memberDto.communeId });
	// 	}
	// }

	private tryToGetMemberFromHistoryState(memberId?: string): void {
		this.memberContext = window.history.state.member as IMemberContext;
		// const memberDto = window.history.state.memberDto as IMemberDto;
		// if (memberDto && !memberInfo) {
		// 	memberInfo = newCommuneMemberInfo(memberDto);
		// }
		// if (memberInfo) {
		// 	this.setMemberInfo(memberInfo);
		// }
		// if (memberDto && (!memberId || memberDto.id === memberId)) {
		// 	this.setMemberDto(memberDto);
		// }
	}
}
