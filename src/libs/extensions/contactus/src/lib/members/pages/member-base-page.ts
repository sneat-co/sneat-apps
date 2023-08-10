//tslint:disable:no-unsafe-any
import { ActivatedRoute } from '@angular/router';
import { TeamBaseComponent } from '@sneat/team/components';
import { IContactContext, ITeamContext } from '@sneat/team/models';
import { MemberPages } from '../constants';
import { MemberComponentBaseParams } from '../member-component-base-params';
// import { IMemberDto } from 'sneat-shared/models/dto/dto-member';
// import { IUserDto } from 'sneat-shared/models/dto/dto-user';
// import { eq } from 'sneat-shared/services/interfaces';
// import { ICommuneMemberInfo } from '../../../models/dto/dto-commune';
// import { CommuneTopPage } from '../../../pages/constants';

export abstract class MemberBasePage extends TeamBaseComponent {
	public segment: 'friends' | 'other' | 'summary' = 'summary';
	// override defaultBackUrl = CommuneTopPage.members;
	// public isDeleted?: boolean;
	// protected currentUserDto: IUserDto | undefined;
	private memberContext?: IContactContext;

	protected constructor(
		className: string,
		route: ActivatedRoute,
		params: MemberComponentBaseParams,
		// protected preloader: NgModulePreloaderService,
		// protected assetService: IAssetService,
	) {
		super(className, route, params.teamParams);
		this.defaultBackPage = 'members';
		this.tryToGetMemberFromHistoryState();
		this.tackMemberId();
	}

	public get member(): IContactContext | undefined {
		return this.memberContext;
	}

	override onTeamDtoChanged(): void {
		super.onTeamDtoChanged();
		console.log('MemberBasePage.onTeamDtoChanged()', this.team?.dto, this.memberContext);
		this.getBriefIfMissing();
	}

	goNew = (event: Event, type: 'new-contact' | 'new-document' | 'new-liability' | 'new-asset', relation?: string): void => {
		console.log('goNew', event, type, relation);
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

	private tackMemberId(): void {
		this.route?.params.subscribe({
			next: params => {
				const id = params['memberID'];
				const teamId = params['teamID'];
				console.log('route', id, params);
				if (id) {
					let team: ITeamContext | undefined = this.team;
					if (!team) {
						team = { id: teamId };
					}
					this.memberContext = { id, team };
				} else {
					this.memberContext = undefined;
				}
				this.getBriefIfMissing();
			},
			error: this.errorLogger.logErrorHandler('failed to process route parameters'),
		});
	}

	private getBriefIfMissing(): void {
		if (this.contactusTeam?.dto?.contacts && this.memberContext?.id && !this.memberContext?.brief) {
			const memberBrief = this.contactusTeam.dto.contacts[this.memberContext.id];
			if (memberBrief) {
				this.memberContext = {
					...this.memberContext,
					brief: memberBrief,
				};
			}
		}
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

	private tryToGetMemberFromHistoryState(): void {
		this.memberContext = window.history.state.member as IContactContext;
	}
}
