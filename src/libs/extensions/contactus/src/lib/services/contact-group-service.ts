import { Injectable } from '@angular/core';
import { INavContext } from '@sneat/core';
import { ContactRole } from '@sneat/dto';
import { NEVER, never, Observable, of } from 'rxjs';


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

export interface IContactGroupBase {
	emoji?: string;
	title: string;
}

export interface IContactGroupBrief extends IContactGroupBase {
	id: string;
}

export interface IContactGroupDto extends IContactGroupBase {
	roles: IContactRoleBrief[];
}

export interface IContactGroup extends IContactGroupDto, IContactGroupBrief {

}


const
	contactTypeTeacher: IContactRoleBrief = { id: 'teacher', title: 'Teacher', emoji: '👩‍🏫' },
	contactTypeBabysitter: IContactRoleBrief = {
		id: 'babysitter',
		title: 'Babysitter',
		emoji: '👧',
		finder: 'babysitters.express',
	},
	contactTypeFriendOfKid: IContactRoleBrief = { id: 'friend', title: 'Friends', emoji: '🚸' },
	contactTypeGP: IContactRoleBrief = { id: 'gp', title: 'Family doctor', emoji: '👩‍⚕️', finder: 'gpconnect.app' },
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

export const defaultFamilyContactGroups: IContactGroup[] = [
	{
		id: 'kid', title: 'Kids', roles: [
			contactTypeTeacher,
			contactTypeBabysitter,
			contactTypeFriendOfKid,
		],
	},
	{
		id: 'house', title: 'House', roles: [
			contactTypeHandyman,
			contactTypePlumber,
			contactTypeElectrician,
			contactTypeGardener,
			contactTypeInsurer,
		],
	},
	{
		id: 'med', title: 'Medical', roles: [
			{ id: 'gp', title: 'GP / Family doctor', emoji: '🩺' },
			{ id: 'med_specialist', 'title': 'Medical specialist', emoji: '🥼' },
		],
	},
	{
		id: 'vehicle', title: 'Vehicle', roles: [
			contactTypeMechanic,
			contactTypeInsurer,
		],
	},
];


@Injectable({ providedIn: 'root' }) // TODO: Dedicated module?
export class ContactGroupService {

	getContactGroups(): Observable<IContactGroupContext[]> {
		return of(defaultFamilyContactGroups.map(g => ({ id: g.id, brief: g, dto: g })));
	}

	getContactGroupByID(id: string): Observable<IContactGroupContext> {
		const cg = defaultFamilyContactGroups.find(cg => cg.id === id);
		if (!cg) {
			return of({ id, dto: null, brief: null });
		}
		const contactGroup: IContactGroupContext = {
			id: cg.id, brief: cg, dto: cg,
		};
		return of(contactGroup);
	}
}

@Injectable({ providedIn: 'root' }) // TODO: Dedicated module?
export class ContactRoleService {
	getContactRoleByID(id: string): Observable<IContactRoleContext> {
		for (let i = 0; i < defaultFamilyContactGroups.length; i++) {
			const cg = defaultFamilyContactGroups[i];
			for (let j = 0; j < cg.roles.length; j++) {
				const role = cg.roles[j];
				if (role.id === id) {
					return of({ id, brief: role });
				}
			}
		}

		return of({ id });
	}
}
