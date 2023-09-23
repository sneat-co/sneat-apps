import { Injectable } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { INavContext } from '@sneat/core';
import { ContactRole, ContactRoleParentOfFriend, RoleTeamMember } from '@sneat/dto';
import { IDtoAndID, ITeamContext } from '@sneat/team/models';
import { TeamItemService } from '@sneat/team/services';
import { Observable, of } from 'rxjs';

export type IContactGroupContext = INavContext<IContactGroupBrief, IContactGroupDto>

export interface IContactRoleBase {
	title: string;
	emoji?: string;
	finder?: string;
}

export interface IContactRoleBrief extends IContactRoleBase {
	id: ContactRole;
}

export type IContactRoleDto = IContactRoleBase

export type IContactRoleContext = INavContext<IContactRoleBrief, IContactRoleDto>

export interface IContactGroupBrief {
	readonly emoji?: string;
	readonly title: string;
}

export interface IContactGroupDto extends IContactGroupBrief {
	readonly roles: readonly IContactRoleBrief[];
}

const
	contactTypeFamilyMember: IContactRoleBrief = { id: 'team_member', title: 'Family member', emoji: '👪' },
	contactTypeTeacher: IContactRoleBrief = { id: 'teacher', title: 'Teacher', emoji: '👩‍🏫' },
	contactTypeBabysitter: IContactRoleBrief = {
		id: 'babysitter',
		title: 'Babysitter',
		emoji: '👧',
		finder: 'babysitters.express',
	},
	contactTypeFriendOfKid: IContactRoleBrief = { id: 'friend', title: 'Friend', emoji: '🚸' },
	contactTypeParentOfFriend: IContactRoleBrief = {
		id: ContactRoleParentOfFriend,
		title: 'Parent of a friend',
		emoji: '🚸',
	},
	// contactTypeGP: IContactRoleBrief = { id: 'gp', title: 'Family doctor', emoji: '👩‍⚕️', finder: 'gpconnect.app' },
	contactTypePlumber: IContactRoleBrief = { id: 'plumber', title: 'Plumber', emoji: '🚽', finder: 'plumbers.express' },
	contactTypeElectrician: IContactRoleBrief = {
		id: 'electrician',
		title: 'Electrician',
		emoji: '🔌',
		finder: 'electricians.express',
	},
	contactTypeHandyman: IContactRoleBrief = {
		id: 'handyman',
		title: 'Handyman',
		emoji: '🔨',
	},
	contactTypeGardener: IContactRoleBrief = {
		id: 'gardener',
		title: 'Gardener',
		emoji: '👨‍🌾',
		finder: 'gardeners.express',
	},
	contactTypeInsurer: IContactRoleBrief = { id: 'insurer', title: 'Insurer', emoji: '🧾' },
	contactTypeMechanic: IContactRoleBrief = { id: 'mechanic', title: 'Mechanic', emoji: '👨‍🔧' };

export const defaultFamilyContactGroupDTOs: readonly IDtoAndID<IContactGroupDto>[] = [
	{
		id: RoleTeamMember,
		dto: {
			title: 'Family members',
			roles: [
				contactTypeFamilyMember,
			],
		},
	},
	{
		id: 'kid',
		dto: {
			title: 'Kids',
			roles: [
				contactTypeTeacher,
				contactTypeBabysitter,
				contactTypeFriendOfKid,
				contactTypeParentOfFriend,
			],
		},
	},
	{
		id: 'house',
		dto: {
			title: 'House',
			roles: [
				contactTypeHandyman,
				contactTypePlumber,
				contactTypeElectrician,
				contactTypeGardener,
				contactTypeInsurer,
			],
		},
	},
	{
		id: 'med',
		dto: {
			title: 'Medical',
			roles: [
				{ id: 'gp', title: 'GP / Family doctor', emoji: '🩺' },
				{ id: 'med_specialist', 'title': 'Medical specialist', emoji: '🥼' },
			],
		},
	},
	{
		id: 'vehicle',
		dto: {
			title: 'Vehicle',
			roles: [
				contactTypeMechanic,
				contactTypeInsurer,
			],
		},
	},
];

export const defaultFamilyContactGroups: readonly IContactGroupContext[] =
	defaultFamilyContactGroupDTOs.map(cg => ({ ...cg, brief: cg.dto }));


@Injectable({ providedIn: 'root' }) // TODO: Dedicated module?
export class ContactGroupService {

	private readonly teamItemService: TeamItemService<IContactGroupBrief, IContactGroupDto>;

	constructor(
		afs: AngularFirestore,
		sneatApiService: SneatApiService,
	) {
		this.teamItemService = new TeamItemService('contactus', 'contact_groups', afs, sneatApiService);
	}

	getContactGroups(): Observable<readonly IContactGroupContext[]> {
		return of(defaultFamilyContactGroups);
	}

	getContactGroupByID(id: string): Observable<IContactGroupContext> {
		const cg = defaultFamilyContactGroups.find(cg => cg.id === id);
		if (!cg) {
			return of({ id, dto: null, brief: undefined });
		}
		return of(cg);
	}

	watchMemberGroupsByTeam(team: ITeamContext, status: 'active' | 'archived' = 'active'): Observable<IContactGroupContext[]> {
		// console.log('watchMemberGroupsByTeamID()', teamID);
		return this.teamItemService.watchTeamItems(team, [{ field: 'status', operator: '==', value: status }]);
	}
}

@Injectable({ providedIn: 'root' }) // TODO: Dedicated module?
export class ContactRoleService {
	getContactRoleByID(id: string): Observable<IContactRoleContext> {
		for (let i = 0; i < defaultFamilyContactGroups.length; i++) {
			const cg = defaultFamilyContactGroups[i];
			for (let j = 0; j < (cg?.dto?.roles?.length || 0); j++) {
				const role = cg.dto?.roles[j];
				if (role?.id === id) {
					return of({ id, brief: role });
				}
			}
		}
		return of({ id });
	}
}
