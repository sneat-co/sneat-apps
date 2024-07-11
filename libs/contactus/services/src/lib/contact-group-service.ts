import { Injectable } from '@angular/core';
import { Firestore as AngularFirestore } from '@angular/fire/firestore';
import { SneatApiService } from '@sneat/api';
import { IIdAndDto } from '@sneat/core';
import {
	IContactGroupBrief,
	IContactGroupDbo,
	IContactRoleBriefWithID,
} from '@sneat/contactus-core';
import { ISpaceContext, ISpaceRef } from '@sneat/team-models';
import { ModuleTeamItemService } from '@sneat/team-services';
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

export const defaultFamilyContactGroupDTOs: readonly IIdAndDto<IContactGroupDbo>[] =
	[
		{
			id: 'family',
			dbo: {
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
			dbo: {
				emoji: '🚸',
				title: 'Kids',
				roles: [
					contactTypeTeacher,
					contactTypeBabysitter,
					contactTypeFriendOfKid,
				],
			},
		},
		{
			id: 'house',
			dbo: {
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
			dbo: {
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
			dbo: {
				emoji: '🚗',
				title: 'Vehicle',
				roles: [contactTypeMechanic, contactTypeInsurer],
			},
		},
	];

export const defaultFamilyContactGroups: readonly IIdAndDto<IContactGroupDbo>[] =
	defaultFamilyContactGroupDTOs.map((cg) => ({ ...cg, brief: cg.dbo }));

@Injectable()
export class ContactGroupService {
	private readonly teamItemService: ModuleTeamItemService<
		IContactGroupBrief,
		IContactGroupDbo
	>;

	constructor(afs: AngularFirestore, sneatApiService: SneatApiService) {
		this.teamItemService = new ModuleTeamItemService(
			'contactus',
			'contact_groups',
			afs,
			sneatApiService,
		);
	}

	getContactGroups(): Observable<readonly IIdAndDto<IContactGroupDbo>[]> {
		return of(defaultFamilyContactGroupDTOs);
	}

	getContactGroupByID(
		id: string,
		team: ISpaceContext,
	): Observable<IIdAndDto<IContactGroupDbo>> {
		const cg = defaultFamilyContactGroups.find((cg) => cg.id === id);
		if (!cg) {
			return of({ id, team, dbo: { title: id } });
		}
		return of(cg);
	}

	watchMemberGroupsByTeam(
		team: ISpaceRef,
		status: 'active' | 'archived' = 'active',
	): Observable<IIdAndDto<IContactGroupDbo>[]> {
		// console.log('watchMemberGroupsByTeamID()', teamID);
		return this.teamItemService.watchModuleSpaceItemsWithTeamRef(team, {
			filter: [{ field: 'status', operator: '==', value: status }],
		});
	}
}
