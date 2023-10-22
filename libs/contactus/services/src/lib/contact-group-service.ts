import { Injectable } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import {
	ContactRoleParentOfFriend,
	IContactGroupBrief,
	IContactGroupDto,
	IContactRoleBriefWithID,
	IIdAndDto,
} from '@sneat/dto';
import {
	IContactGroupContext,
	ITeamContext,
	ITeamRef,
} from '@sneat/team/models';
import { ModuleTeamItemService } from '@sneat/team/services';
import { Observable, of } from 'rxjs';

const contactTypeFamilyMember: IContactRoleBriefWithID = {
		id: 'member',
		title: 'Family member',
		emoji: '👪',
	},
	contactTypeRelative: IContactRoleBriefWithID = {
		id: 'relative',
		title: 'Relative',
		emoji: '👪',
	},
	contactTypeTeacher: IContactRoleBriefWithID = {
		id: 'teacher',
		title: 'Teacher',
		emoji: '👩‍🏫',
	},
	contactTypeBabysitter: IContactRoleBriefWithID = {
		id: 'babysitter',
		title: 'Babysitter',
		emoji: '👧',
		finder: 'babysitters.express',
	},
	contactTypeFriendOfKid: IContactRoleBriefWithID = {
		id: 'friend',
		title: 'Friend',
		emoji: '🚸',
	},
	contactTypeParentOfFriend: IContactRoleBriefWithID = {
		id: ContactRoleParentOfFriend,
		title: 'Parent of a friend',
		emoji: '🚸',
	},
	// contactTypeGP: IContactRoleBrief = { id: 'gp', title: 'Family doctor', emoji: '👩‍⚕️', finder: 'gpconnect.app' },
	contactTypePlumber: IContactRoleBriefWithID = {
		id: 'plumber',
		title: 'Plumber',
		emoji: '🚽',
		finder: 'plumbers.express',
	},
	contactTypeElectrician: IContactRoleBriefWithID = {
		id: 'electrician',
		title: 'Electrician',
		emoji: '🔌',
		finder: 'electricians.express',
	},
	contactTypeHandyman: IContactRoleBriefWithID = {
		id: 'handyman',
		title: 'Handyman',
		emoji: '🔨',
	},
	contactTypeGardener: IContactRoleBriefWithID = {
		id: 'gardener',
		title: 'Gardener',
		emoji: '👨‍🌾',
		finder: 'gardeners.express',
	},
	contactTypeInsurer: IContactRoleBriefWithID = {
		id: 'insurer',
		title: 'Insurer',
		emoji: '🧾',
	},
	contactTypeMechanic: IContactRoleBriefWithID = {
		id: 'mechanic',
		title: 'Mechanic',
		emoji: '👨‍🔧',
	};

export const defaultFamilyContactGroupDTOs: readonly IIdAndDto<IContactGroupDto>[] =
	[
		{
			id: 'family',
			dto: {
				emoji: '👪',
				title: 'Family',
				roles: [
					contactTypeFamilyMember,
					contactTypeRelative,
					contactTypeFriendOfKid,
				],
			},
		},
		{
			id: 'kid',
			dto: {
				emoji: '🚸',
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
				emoji: '🏠',
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
				emoji: '⚕️',
				title: 'Medical',
				roles: [
					{ id: 'gp', title: 'GP / Family doctor', emoji: '🩺' },
					{ id: 'med_specialist', title: 'Medical specialist', emoji: '🥼' },
				],
			},
		},
		{
			id: 'vehicle',
			dto: {
				emoji: '🚗',
				title: 'Vehicle',
				roles: [contactTypeMechanic, contactTypeInsurer],
			},
		},
	];

export const defaultFamilyContactGroups: readonly IIdAndDto<IContactGroupDto>[] =
	defaultFamilyContactGroupDTOs.map((cg) => ({ ...cg, brief: cg.dto }));

@Injectable({ providedIn: 'root' }) // TODO: Dedicated module?
export class ContactGroupService {
	private readonly teamItemService: ModuleTeamItemService<
		IContactGroupBrief,
		IContactGroupDto
	>;

	constructor(afs: AngularFirestore, sneatApiService: SneatApiService) {
		this.teamItemService = new ModuleTeamItemService(
			'contactus',
			'contact_groups',
			afs,
			sneatApiService,
		);
	}

	getContactGroups(): Observable<readonly IIdAndDto<IContactGroupDto>[]> {
		return of(defaultFamilyContactGroupDTOs);
	}

	getContactGroupByID(
		id: string,
		team: ITeamContext,
	): Observable<IIdAndDto<IContactGroupDto>> {
		const cg = defaultFamilyContactGroups.find((cg) => cg.id === id);
		if (!cg) {
			return of({ id, team, dto: { title: id } });
		}
		return of(cg);
	}

	watchMemberGroupsByTeam(
		team: ITeamRef,
		status: 'active' | 'archived' = 'active',
	): Observable<IContactGroupContext[]> {
		// console.log('watchMemberGroupsByTeamID()', teamID);
		return this.teamItemService.watchModuleTeamItemsWithTeamRef(team, [
			{ field: 'status', operator: '==', value: status },
		]);
	}
}
