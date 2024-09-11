import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SpaceMemberType, SpaceMemberTypeEnum } from '@sneat/auth-models';
import {
	ContactusServicesModule,
	ContactusSpaceService,
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
	MemberGroupType,
	MemberGroupTypeAdults,
	MemberGroupTypeKids,
	MemberGroupTypeOther,
	MemberGroupTypePets,
	IContactusSpaceDbo,
	IMemberGroupContext,
} from '@sneat/contactus-core';
import { isSpaceSupportsMemberGroups } from '@sneat/dto';
import {
	SpaceComponentBaseParams,
	SpaceCoreComponentsModule,
} from '@sneat/team-components';
import { zipMapBriefsWithIDs } from '@sneat/team-models';
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
	providers: [SpaceComponentBaseParams, ContactComponentBaseParams],
	standalone: true,
	imports: [
		IonicModule,
		CommonModule,
		FormsModule,
		SpaceCoreComponentsModule,
		MembersListComponent,
		ContactusServicesModule,
	],
})
export class MembersPageComponent extends MembersBasePage {
	public contactsByMember: Record<
		string,
		readonly IIdAndBrief<IContactBrief>[]
	> = {};
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

	readonly memberType: SpaceMemberType = 'member';

	constructor(
		route: ActivatedRoute,
		// private readonly memberGroupService: MemberGroupService,
		params: SpaceComponentBaseParams,
		memberService: MemberService,
		contactusTeamService: ContactusSpaceService,
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

	override onSpaceModuleDtoChanged(dto: IContactusSpaceDbo | null): void {
		super.onSpaceModuleDtoChanged(dto);
		this.processContactusSpaceDbo(dto);
	}

	goGroup(memberGroup: IMemberGroupContext): void {
		this.navigateForwardToSpacePage(`group/${memberGroup.id}`, {
			state: { memberGroup },
		}).catch(this.logErrorHandler('failed to navigate to members group page'));
	}

	protected goNewMemberPage(group?: MembersGroup): void {
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
		console.log(`MembersPageComponent.onTeamDtoChanged()`);
		// if (this.team?.dto?.numberOf?.members) {
		// 	this.loadingStubs = Array(this.team?.dto?.numberOf?.members).fill(1);
		// }
		// if (!isNaN(this.prevMembersCount) && this.prevMembersCount != this.commune.numberOf.members) {
		//     this.loadData();
		// }
		this.loadData('onTeamDtoChanged');
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
		// 		.pipe(takeUntil(this.teamIDChanged$))
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

	private readonly processContactusSpaceDbo = (
		dto?: IContactusSpaceDbo | null,
	): void => {
		console.log('MembersPageComponent.processContactusSpaceDbo()', dto);
		const space = this.space;
		this.members = zipMapBriefsWithIDs(dto?.contacts).map((m) => ({
			...m,
			space,
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
				if (m.dbo?.type === SpaceMemberTypeEnum.pet) {
					addedToGroup = true;
					pets.push(m);
				}
				if (!this.space) {
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
