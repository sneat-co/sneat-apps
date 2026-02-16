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
  addSpace,
  IContactBrief,
  IContactDbo,
  IContactusSpaceDbo,
  IContactWithBrief,
  MemberGroupType,
  MemberGroupTypeAdults,
  MemberGroupTypeKids,
  MemberGroupTypeOther,
  MemberGroupTypePets,
} from '@sneat/contactus-core';
import { WithSpaceInput } from '@sneat/space-services';
import { ClassName } from '@sneat/ui';
import { MembersByRoleComponent } from '../members-by-role/members-by-role.component';
import { MemberGroup } from '../members-by-role/member-group';
import { IIdAndBriefAndOptionalDbo } from '@sneat/core';
import { zipMapBriefsWithIDs } from '@sneat/space-models';

@Component({
  selector: 'sneat-family-members',
  template: `
    <sneat-members-by-role
      [$space]="$space()"
      [memberGroups]="predefinedMemberGroups"
      (addMember)="addMember.emit($event)"
    />
  `,
  imports: [MembersByRoleComponent],
  providers: [{ provide: ClassName, useValue: 'FamilyMembersComponent' }],
})
export class FamilyMembersComponent
  extends WithSpaceInput
  implements OnChanges
{
  @Input({ required: true })
  public contactusSpaceDbo?: IContactusSpaceDbo | null;

  @Output() public readonly addMember = new EventEmitter<MemberGroup>();

  public members?: readonly IIdAndBriefAndOptionalDbo<
    IContactBrief,
    IContactDbo
  >[];

  protected adults: MemberGroup = {
    id: MemberGroupTypeAdults,
    emoji: '🧓',
    role: 'adult',
    plural: 'Adults',
    addLabel: 'Add adult',
  };
  protected children: MemberGroup = {
    id: MemberGroupTypeKids,
    emoji: '🚸',
    role: 'child',
    plural: 'Children',
    addLabel: 'Add child',
  };
  protected pets: MemberGroup = {
    id: MemberGroupTypePets,
    emoji: '🐕',
    plural: 'Pets',
    addLabel: 'Add pet',
    role: 'animal',
  };
  protected other: MemberGroup = {
    id: MemberGroupTypeOther,
    emoji: '👻',
    plural: 'Other',
    addLabel: '',
    role: 'other',
  };

  protected predefinedMemberGroups: readonly MemberGroup[] = [
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
// console.log(
      'MembersPageComponent.processContactusSpaceDbo()',
      contactusSpaceDbo,
    );
    const space = this.$space();
    this.members = zipMapBriefsWithIDs(contactusSpaceDbo?.contacts).map((m) =>
      Object.assign(m, { space }),
    );
    this.processMembers();
  };

  private processMembers(): void {
// console.log('MembersPageComponent.processMembers()', this.members);
    const space = this.$space();
    if (!space) {
      throw new Error('!this.$space()');
    }
    const adults: IContactWithBrief[] = [];
    const children: IContactWithBrief[] = [];
    const pets: IContactWithBrief[] = [];
    const other: IContactWithBrief[] = [];
    // this.adults = {...this.adults, members: []};
    // this.children = {...this.children, members = []};
    // this.other = {...this.other, members = []};
    let addedToGroup = false;
    this.members
      ?.filter((c) => c.brief?.roles?.includes('member'))
      .forEach((c) => {
        if (c.brief?.type === 'animal') {
          pets.push(c);
          addedToGroup = true;
        }
        switch (c.brief?.ageGroup) {
          case 'adult':
            adults?.push(c);
            addedToGroup = true;
            break;
          case 'child':
            children?.push(c);
            addedToGroup = true;
            break;
        }
        if (c.dbo?.type === SpaceMemberTypeEnum.pet) {
          addedToGroup = true;
          pets.push(c);
        }
        if (c.brief?.groupIDs?.length) {
          c.brief.groupIDs.forEach((groupID) => {
            const groupIndex = this.predefinedMemberGroups.findIndex(
              (g) => g.id === groupID,
            );
            let group: MemberGroup;
            if (groupIndex < 0) {
              group = {
                id: groupID as MemberGroupType,
                role: groupID,
                plural: groupID + 's',
                contacts: [],
                emoji: '',
                addLabel: 'Add member',
              };
            } else {
              group = this.predefinedMemberGroups[groupIndex];
            }
            if (!group.contacts) {
              group = { ...group, contacts: [{ ...c, space }] };
            } else if (!group.contacts.find((m2) => m2.id === c.id)) {
              group = {
                ...group,
                contacts: [...group.contacts, { ...c, space }],
              };
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
          other.push(c);
        }
      });
    this.adults = { ...this.adults, contacts: adults.map(addSpace(space)) };
    this.children = {
      ...this.children,
      contacts: children.map(addSpace(space)),
    };
    this.pets = { ...this.pets, contacts: pets.map(addSpace(space)) };
    this.other = { ...this.other, contacts: other.map(addSpace(space)) };
    this.predefinedMemberGroups = [
      this.adults,
      this.children,
      this.pets,
      this.other,
    ].map((g) => Object.assign(g, { contacts: g.contacts || [] }));
  }
}
