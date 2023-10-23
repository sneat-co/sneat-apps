import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TeamMemberTypeEnum } from '@sneat/auth-models';
import {
	ContactusTeamService,
	MemberGroupService,
	MemberService,
} from '@sneat/contactus-services';
import {
	ContactComponentBaseParams,
	MembersListComponent,
} from '@sneat/contactus-shared';
import { IIdAndBrief } from '@sneat/core';
import {
	IContactBrief,
	isTeamSupportsMemberGroups,
	MemberGroupType,
	MemberGroupTypeAdults,
	MemberGroupTypeKids,
	MemberGroupTypeOther,
	MemberGroupTypePets,
	TeamMemberType,
} from '@sneat/dto';
import {
	TeamComponentBaseParams,
	TeamCoreComponentsModule,
} from '@sneat/team-components';
import {
	IContactusTeamDto,
	IMemberGroupContext,
	zipMapBriefsWithIDs,
} from '@sneat/team-models';
import { takeUntil } from 'rxjs';
import { MembersBasePage } from '../../members-base-page';

interface MembersGroup {
	readonly id: MemberGroupType;
	readonly role: string;
	readonly emoji: string;
	readonly plural: string;
	readonly addLabel: string;
	readonly members?: readonly IIdAndBrief<IContactBrief>[];
}

@Component({
	selector: 'sneat-members-page',
	templateUrl: 'members-page.component.html',
	providers: [TeamComponentBaseParams, ContactComponentBaseParams],
	standalone: true,
	imports: [
		IonicModule,
		CommonModule,
		FormsModule,
		TeamCoreComponentsModule,
		MembersListComponent,
	],
})
export class MembersPageComponent
	extends MembersBasePage
	implements AfterViewInit
{
	private prevMembersCount?: number;
	public contactsByMember: {
		[id: string]: readonly IIdAndBrief<IContactBrief>[];
	} = {};
	public adults: MembersGroup = {
		id: MemberGroupTypeAdults,
		emoji: '🧓',
		role: 'adult',
		plural: 'Adults',
		addLabel: 'Add adult',
	};
	public children: MembersGroup = {
		id: MemberGroupTypeKids,
		emoji: '🚸',
		role: 'child',
		plural: 'Children',
		addLabel: 'Add child',
	};
	public pets: MembersGroup = {
		id: MemberGroupTypePets,
		emoji: '🐕',
		plural: 'Pets',
		addLabel: 'Add pet',
		role: 'animal',
	};
	public other: MembersGroup = {
		id: MemberGroupTypeOther,
		emoji: '👻',
		plural: 'Other',
		addLabel: '',
		role: 'other',
	};
	public memberGroups?: readonly IMemberGroupContext[];
	public loadingStubs?: number[];
	public segment: 'all' | 'groups' = 'all';
	public listMode: 'list' | 'cards' = 'list';
	// public membersByGroupId: { [id: string]: IMemberContext[] } = {};

	protected predefinedMemberGroups: MembersGroup[] = [
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
		contactusTeamService: ContactusTeamService,
		private readonly memberGroupService: MemberGroupService,
	) {
		super(
			'MembersPageComponent',
			route,
			params,
			contactusTeamService,
			memberService,
		);
	}

	override onTeamModuleDtoChanged(dto: IContactusTeamDto | null): void {
		super.onTeamModuleDtoChanged(dto);
		this.processContactusTeamDto(dto);
	}

	ngAfterViewInit(): void {
		this.preloader.preload(['member', 'member-new', 'commune-overview']);
	}

	goGroup(memberGroup: IMemberGroupContext): void {
		this.navigateForwardToTeamPage(`group/${memberGroup.id}`, {
			state: { memberGroup },
		}).catch(this.logErrorHandler('failed to navigate to members group page'));
	}

	protected goNewMemberPage(group?: MembersGroup): void {
		const queryParams: Params | undefined = group
			? { group: group.id }
			: undefined;
		this.navigateForwardToTeamPage('new-member', {
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
				this.navigateForwardToTeamPage('new-group').catch(
					this.logErrorHandler('failed to navigate to new group page'),
				);
				break;
			default:
				alert(`Unknown segment: ${this.segment}`);
				return;
		}
	}

	protected readonly memberGroupID = (_: number, o: MembersGroup) => o.id;
	protected readonly memberGroupContextID = (
		_: number,
		o: IMemberGroupContext,
	) => o.id;

	override onTeamDtoChanged(): void {
		super.onTeamDtoChanged();
		if (!this.team) {
			throw new Error('!this.commune');
		}
		console.log(
			`MembersPageComponent.onTeamDtoChanged() => members: oldCount=${this.prevMembersCount}, newCount=${this.team.dto?.numberOf?.members}`,
		);
		if (this.team?.dto?.numberOf?.members) {
			this.loadingStubs = Array(this.team?.dto?.numberOf?.members).fill(1);
		}
		// if (!isNaN(this.prevMembersCount) && this.prevMembersCount != this.commune.numberOf.members) {
		//     this.loadData();
		// }
		this.loadData('onTeamDtoChanged');
		this.prevMembersCount = this.team?.dto?.numberOf?.members || 0;
	}

	private loadData(source: string): void {
		console.log(
			`MembersPageComponent.loadData(source=${source})`,
			this.contactusTeam?.dto?.contacts,
		);

		// this.unsubscribe();
		const team = this.team;
		if (!team) {
			throw new Error('!this.team');
		}
		// this.noGroupMembers = this.team?.brief && isTeamSupportsMemberGroups(this.team.brief.type) ? [] : undefined;

		const contactusTeam = this.contactusTeam;

		if (contactusTeam?.dto?.contacts) {
			// this.processContactusTeamDto(contactusTeam.dto);
		} else {
			this.contactService
				.watchContactsWithRole(team, 'team_member') // TODO: use constant
				.pipe(takeUntil(this.teamIDChanged$))
				.subscribe({
					next: (members) => {
						console.log(
							`MembersPageComponent.loadData(source=${source}), members =>`,
							members,
						);
						if (members?.length) {
							// TODO: deep equal
							members.forEach((m) => {
								if (m.id) {
									if (m.dto?.relatedContacts) {
										this.contactsByMember[m.id] = zipMapBriefsWithIDs(
											m.dto.relatedContacts,
										);
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
			throw new Error('not implemented yet due to refactoring');
			// this.contactService.watchContactsByRole(team)
			// 	.subscribe(memberGroups => {
			// 		if (memberGroups && (!this.memberGroups || memberGroups.length !== this.memberGroups.length)) { // TODO: deep equal
			// 			this.memberGroups = memberGroups;
			// 		}
			// 	});
		}
	}

	private readonly processContactusTeamDto = (
		dto?: IContactusTeamDto | null,
	): void => {
		console.log('MembersPageComponent.processContactusTeamDto()', dto);
		const team = this.team;
		this.members = zipMapBriefsWithIDs(dto?.contacts).map((m) => ({
			...m,
			team,
		}));
		this.processMembers();
	};

	private processMembers(): void {
		console.log('MembersPageComponent.processMembers()', this.members);
		const adults: IIdAndBrief<IContactBrief>[] = [];
		const children: IIdAndBrief<IContactBrief>[] = [];
		const pets: IIdAndBrief<IContactBrief>[] = [];
		const other: IIdAndBrief<IContactBrief>[] = [];
		// this.adults = {...this.adults, members: []};
		// this.children = {...this.children, members = []};
		// this.other = {...this.other, members = []};
		let addedToGroup = false;
		this.members
			?.filter((c) => c.brief?.roles?.includes('member'))
			.forEach((m) => {
				if (m.brief?.type === 'animal') {
					pets.push(m);
					addedToGroup = true;
				}
				switch (m.brief?.ageGroup) {
					case 'adult':
						adults?.push(m);
						addedToGroup = true;
						break;
					case 'child':
						children?.push(m);
						addedToGroup = true;
						break;
				}
				if (m.dto?.type === TeamMemberTypeEnum.pet) {
					addedToGroup = true;
					pets.push(m);
				}
				if (!this.team) {
					throw new Error('!this.team');
				}
				if (m.brief?.groupIDs?.length) {
					m.brief.groupIDs.forEach((groupID) => {
						const groupIndex = this.predefinedMemberGroups.findIndex(
							(g) => g.id === groupID,
						);
						let group: MembersGroup;
						if (groupIndex < 0) {
							group = {
								id: groupID as MemberGroupType,
								role: groupID,
								plural: groupID + 's',
								members: [],
								emoji: '',
								addLabel: 'Add member',
							};
						} else {
							group = this.predefinedMemberGroups[groupIndex];
						}
						if (!group.members) {
							group = { ...group, members: [m] };
						} else if (!group.members.find((m2) => m2.id === m.id)) {
							group = { ...group, members: [...group.members, m] };
						}
						this.predefinedMemberGroups[groupIndex] = group;
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
					other.push(m);
				}
			});
		this.adults = { ...this.adults, members: adults };
		this.children = { ...this.children, members: children };
		this.pets = { ...this.pets, members: pets };
		this.other = { ...this.other, members: other };
		this.predefinedMemberGroups = [
			this.adults,
			this.children,
			this.pets,
			this.other,
		].map((g) => ({ ...g, members: g.members || [] }));
	}
}
