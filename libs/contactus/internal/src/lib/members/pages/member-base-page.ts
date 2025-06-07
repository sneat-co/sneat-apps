import { IContactContext } from '@sneat/contactus-core';
import { ContactService } from '@sneat/contactus-services';
import { ContactBasePage } from '../../pages/contact-base-page';

export abstract class MemberBasePage extends ContactBasePage {
	public segment: 'friends' | 'other' | 'summary' = 'summary';

	// override defaultBackUrl = CommuneTopPage.members;
	// public isDeleted?: boolean;
	// protected currentUserDto: IUserDto | undefined;
	private memberContext?: IContactContext;

	protected constructor(contactService: ContactService) {
		super(contactService, 'members');
	}

	public get member(): IContactContext | undefined {
		return this.memberContext;
	}

	protected goNew = (
		event: Event,
		type: 'new-contact' | 'new-document' | 'new-liability' | 'new-asset',
		relation?: string,
	): void => {
		console.log('goNew', event, type, relation);
		// this.navigateForward(
		// 	type,
		// 	{ member: this.memberContext, relation },
		// 	{ memberDto: this.memberDto });
	};

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
}
