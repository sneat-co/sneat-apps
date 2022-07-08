import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AgeGroup, IContact2Member, isTeamSupportsMemberGroups, MemberType } from '@sneat/dto';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { IMemberContext, IMemberGroupContext } from '@sneat/team/models';
import { memberContextFromBrief, MemberGroupService, MemberService } from '@sneat/team/services';
import { takeUntil } from 'rxjs';
import { MembersBasePage } from '../members-base-page';

interface AgeGroupWithMembers {
	readonly id: AgeGroup;
	readonly plural: string;
	readonly addLabel: string;
	members?: IMemberContext[];
}

@Component({
	selector: 'sneat-members-page',
	templateUrl: 'members-page.component.html',
	styleUrls: ['members-page.component.scss'],
	providers: [TeamComponentBaseParams],
	// animations: [
	//     trigger('items', [
	//         state('void', style({
	//             opacity: 0,
	//             // transform: 'translateY(-100%)',
	//         })),
	//         state('loaded', style({})),
	//         transition('void => loaded', [
	//             animate('0.2s'),
	//         ])
	//     ]),
	// ],
})
export class MembersPageComponent extends MembersBasePage implements AfterViewInit {
	private prevMembersCount?: number;
	public contactsByMember: { [id: string]: IContact2Member[] } = {};
	public readonly adults: AgeGroupWithMembers = {id: 'adult', plural: 'Adults', addLabel: 'Add adult'};
	public readonly children: AgeGroupWithMembers = {id: 'child', plural: 'Children', addLabel: 'Add child'};
	public readonly unknownAge: AgeGroupWithMembers = {id: 'unknown', plural: 'Other', addLabel: ''};
	public memberGroups?: IMemberGroupContext[];
	public loadingStubs?: number[];
	public segment: 'all' | 'groups' = 'all';
	public listMode: 'list' | 'cards' = 'list';
	public membersByGroupId: { [id: string]: IMemberContext[] } = {};
	public noGroupMembers?: IMemberContext[];

	public readonly memberByAgeGroup: readonly AgeGroupWithMembers[] = [
		this.adults,
		this.children,
		this.unknownAge,
	];

	readonly memberType: MemberType = 'member';

	constructor(
		route: ActivatedRoute,
		// private readonly memberGroupService: MemberGroupService,
		params: TeamComponentBaseParams,
		memberService: MemberService,
		private readonly memberGroupService: MemberGroupService,
	) {
		super('MembersPageComponent', route, params, memberService);
	}


	ngAfterViewInit(): void {
		this.preloader.preload([
			'member',
			'member-new',
			'commune-overview',
		]);
	}

	goGroup(memberGroup: IMemberGroupContext): void {
		this.navigateForwardToTeamPage(`group/${memberGroup.id}`, { state: { memberGroup } })
			.catch(this.logErrorHandler('failed to navigate to members group page'));
	}

	public goNew(ageGroup?: AgeGroup): void {
		switch (this.segment) {
			case 'all':
				this.navigateForwardToTeamPage('new-member', { queryParams: { ageGroup } })
					.catch(this.logErrorHandler('failed to navigate to new member page with age parameter'));
				break;
			case 'groups':
				this.navigateForwardToTeamPage('new-group')
					.catch(this.logErrorHandler('failed to navigate to new group page'));
				break;
			default:
				alert(`Unknown segment: ${this.segment}`);
				return;
		}
	}

	public readonly id = (i: number, v: { id: string }): string => v.id;

	override onTeamDtoChanged(): void {
		super.onTeamDtoChanged();
		if (!this.team) {
			throw new Error('!this.commune');
		}
		console.log(`MembersPageComponent.onCommuneChanged() => members: oldCount=${this.prevMembersCount}, newCount=${this.team.dto?.numberOf?.members}`);
		if (this.team?.dto?.numberOf?.members) {
			this.loadingStubs = Array(this.team?.dto?.numberOf?.members)
				.fill(1);
		}
		// if (!isNaN(this.prevMembersCount) && this.prevMembersCount != this.commune.numberOf.members) {
		//     this.loadData();
		// }
		this.loadData('onTeamDtoChanged');
		this.prevMembersCount = this.team?.dto?.numberOf?.members || 0;
	}

	private loadData(source: string): void {
		console.log(`MembersPageComponent.loadData(source=${source})`, this.team?.dto?.members);
		// this.unsubscribe();
		if (!this.team) {
			throw new Error('!this.team');
		}
		this.noGroupMembers = this.team?.brief && isTeamSupportsMemberGroups(this.team.brief.type) ? [] : undefined;

		if (this.team.dto?.members) {
			this.members = this.team.dto.members.map(m => memberContextFromBrief(m, this.team));
			this.processMembers();
		} else {
			this.membersService.watchTeamMembers(this.team)
				.pipe(
					takeUntil(this.teamIDChanged$),
				)
				.subscribe({
					next: members => {
						console.log(`MembersPageComponent.loadData(source=${source}), members =>`, members);
						if (members?.length) { // TODO: deep equal
							members.forEach(m => {
								if (m.id) {
									if (m.dto?.contacts?.length) {
										this.contactsByMember[m.id] = m.dto.contacts;
									} else if (this.contactsByMember[m.id]) {
										// tslint:disable-next-line:no-dynamic-delete
										delete this.contactsByMember[m.id];
									}
								}
							});
							this.members = members;
							this.processMembers();
						}
					},
				});
		}

		if (this.team.brief && isTeamSupportsMemberGroups(this.team.brief.type)) {
			this.memberGroupService.watchMemberGroupsByTeam(this.team)
				.subscribe(memberGroups => {
					if (memberGroups && (!this.memberGroups || memberGroups.length !== this.memberGroups.length)) { // TODO: deep equal
						this.memberGroups = memberGroups;
					}
				});
		}
	}

	private processMembers(): void {
		console.log('MembersPageComponent.processMembers()', this.members);
		this.adults.members = [];
		this.children.members = [];
		this.unknownAge.members = [];
		this.members?.forEach(m => {
			switch (m.brief?.ageGroup) {
				case 'adult':
					this.adults.members?.push(m);
					break;
				case 'child':
					this.children.members?.push(m);
					break;
				default:
					this.unknownAge.members?.push(m);
					break;
			}
			if (!this.team) {
				throw new Error('!this.team');
			}
			if (m.dto?.groupIDs?.length) {
				m.dto.groupIDs.forEach(groupID => {
					if (this.membersByGroupId[groupID]) {
						this.membersByGroupId[groupID].push(m);
					} else {
						this.membersByGroupId[groupID] = [m];
					}
				});
			} else if (this.team.brief && isTeamSupportsMemberGroups(this.team.brief.type)) {
				if (this.noGroupMembers) {
					this.noGroupMembers.push(m);
				}
			}
		});
	}
}
