import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	Output,
	SimpleChanges,
} from '@angular/core';
import { SpaceMemberTypeEnum } from '@sneat/auth-models';
import {
	IContactBrief,
	IContactDbo,
	IContactusSpaceDbo,
	MemberGroupType,
	MemberGroupTypeAdults,
	MemberGroupTypeKids,
	MemberGroupTypeOther,
	MemberGroupTypePets,
} from '@sneat/contactus-core';
import { MembersByRoleComponent } from '../members-by-role/members-by-role.component';
import { MembersGroup } from '../members-by-role/member-group';
import { IIdAndBrief, IIdAndBriefAndOptionalDbo } from '@sneat/core';
import { ISpaceContext, zipMapBriefsWithIDs } from '@sneat/space-models';

@Component({
	selector: 'sneat-family-members',
	template: `
		<sneat-members-by-role
			[space]="space"
			[memberGroups]="predefinedMemberGroups"
			(addMember)="addMember.emit($event)"
		/>
	`,
	imports: [MembersByRoleComponent],
})
export class FamilyMembersComponent implements OnChanges {
	@Input({ required: true }) public space?: ISpaceContext;

	@Input({ required: true })
	public contactusSpaceDbo?: IContactusSpaceDbo | null;

	@Output() public readonly addMember = new EventEmitter<MembersGroup>();

	public members?: readonly IIdAndBriefAndOptionalDbo<
		IContactBrief,
		IContactDbo
	>[];

	protected adults: MembersGroup = {
		id: MemberGroupTypeAdults,
		emoji: '🧓',
		role: 'adult',
		plural: 'Adults',
		addLabel: 'Add adult',
	};
	protected children: MembersGroup = {
		id: MemberGroupTypeKids,
		emoji: '🚸',
		role: 'child',
		plural: 'Children',
		addLabel: 'Add child',
	};
	protected pets: MembersGroup = {
		id: MemberGroupTypePets,
		emoji: '🐕',
		plural: 'Pets',
		addLabel: 'Add pet',
		role: 'animal',
	};
	protected other: MembersGroup = {
		id: MemberGroupTypeOther,
		emoji: '👻',
		plural: 'Other',
		addLabel: '',
		role: 'other',
	};

	protected predefinedMemberGroups: readonly MembersGroup[] = [
		this.adults,
		this.children,
		this.pets,
		this.other,
	];

	public ngOnChanges(changes: SimpleChanges): void {
		if (changes['contactusSpaceDbo']) {
			this.processContactusSpaceDbo(this.contactusSpaceDbo);
		}
	}

	private readonly processContactusSpaceDbo = (
		contactusSpaceDbo?: IContactusSpaceDbo | null,
	): void => {
		console.log(
			'MembersPageComponent.processContactusSpaceDbo()',
			contactusSpaceDbo,
		);
		const space = this.space;
		this.members = zipMapBriefsWithIDs(contactusSpaceDbo?.contacts).map(
			(m) => ({
				...m,
				space,
			}),
		);
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
						this.predefinedMemberGroups = this.predefinedMemberGroups.map(
							(g, i) => (i === groupIndex ? group : g),
						);
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
