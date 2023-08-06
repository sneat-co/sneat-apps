import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { TeamMemberTypeEnum } from '@sneat/auth-models';
import {
	IContact2ContactInRequest,
	isTeamSupportsMemberGroups,
	MemberGroupTypeAdults,
	MemberGroupTypeKids, MemberGroupTypePets,
	TeamMemberType,
} from '@sneat/dto';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { IMemberContext, IMemberGroupContext, zipMapBriefsWithIDs } from '@sneat/team/models';
import { MemberGroupService, MemberService } from '@sneat/extensions/contactus';
import { takeUntil } from 'rxjs';
import { MembersBasePage } from '../members-base-page';

interface MembersGroup {
	readonly id: string;
	readonly emoji: string;
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
	public contactsByMember: { [id: string]: IContact2ContactInRequest[] } = {};
	public readonly adults: MembersGroup = {
		id: MemberGroupTypeAdults,
		emoji: '🧓',
		plural: 'Adults',
		addLabel: 'Add adult',
	};
	public readonly children: MembersGroup = {
		id: MemberGroupTypeKids,
		emoji: '🚸',
		plural: 'Children',
		addLabel: 'Add child',
	};
	public readonly pets: MembersGroup = { id: MemberGroupTypePets, emoji: '🐕', plural: 'Pets', addLabel: 'Add pet' };
	public readonly other: MembersGroup = { id: MemberGroupTypePets, emoji: '👻', plural: 'Other', addLabel: '' };
	public memberGroups?: IMemberGroupContext[];
	public loadingStubs?: number[];
	public segment: 'all' | 'groups' = 'all';
	public listMode: 'list' | 'cards' = 'list';
	// public membersByGroupId: { [id: string]: IMemberContext[] } = {};

	protected predefinedMemberGroups: readonly MembersGroup[] = [
		this.adults,
		this.children,
		this.pets,
		this.other,
	];

	readonly memberType: TeamMemberType = 'member';

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

	protected goNewMemberPage(group?: MembersGroup): void {
		const queryParams: Params | undefined = group ? { group: group.id } : undefined;
		this.navigateForwardToTeamPage('new-member', { queryParams, state: { group } })
			.catch(this.logErrorHandler('failed to navigate to new member page with age parameter'));
	}

	public goNew(): void {
		switch (this.segment) {
			case 'all':
				this.goNewMemberPage();
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

	protected readonly id = (_: number, o: { id: string }) => o.id;

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
		console.log(`MembersPageComponent.loadData(source=${source})`, this.contactusTeam?.dto?.contacts);
		// this.unsubscribe();
		const team = this.team;
		if (!team) {
			throw new Error('!this.team');
		}
		// this.noGroupMembers = this.team?.brief && isTeamSupportsMemberGroups(this.team.brief.type) ? [] : undefined;

		const contactusTeam = this.contactusTeam;

		if (contactusTeam?.dto?.contacts) {
			this.members = zipMapBriefsWithIDs(contactusTeam.dto.contacts).map(m => ({ ...m, team }));
			this.processMembers();
		} else {
			this.membersService.watchTeamMembers(team)
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

		if (team.type && isTeamSupportsMemberGroups(team.type)) {
			this.memberGroupService.watchMemberGroupsByTeam(team)
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
		this.other.members = [];
		let addedToGroup = false;
		this.members?.forEach(m => {
			switch (m.brief?.ageGroup) {
				case 'adult':
					this.adults.members?.push(m);
					addedToGroup = true;
					break;
				case 'child':
					this.children.members?.push(m);
					addedToGroup = true;
					break;
			}
			if (m.dto?.type === TeamMemberTypeEnum.pet) {
				addedToGroup = true;
				this.pets.members?.push(m);
			}
			if (!this.team) {
				throw new Error('!this.team');
			}
			if (m.brief?.groupIDs?.length) {
				m.brief.groupIDs.forEach(groupID => {
					let group = this.predefinedMemberGroups.find(g => g.id === groupID);
					if (!group) {
						group = { id: groupID, plural: groupID + 's', members: [], emoji: '', addLabel: 'Add member' };
					}
					if (!group.members) {
						group.members = [m];
					} else {
						if (!group.members.find(m2 => m2.id === m.id)) {
							group.members.push(m);
						}
					}
					addedToGroup = true;
					// if (this.membersByGroupId[groupID]) {
					// 	this.membersByGroupId[groupID].push(m);
					// } else {
					// 	this.membersByGroupId[groupID] = [m];
					// }
				});
				// } else if (this.team.brief && isTeamSupportsMemberGroups(this.team.brief.type)) {
				// 	if (this.noGroupMembers) {
				// 		this.noGroupMembers.push(m);
				// 	}
			}
			if (!addedToGroup) {
				this.other.members?.push(m);
			}
		});
		this.predefinedMemberGroups = this.predefinedMemberGroups.map(g => ({ ...g, members: g.members || [] }));
	}
}
