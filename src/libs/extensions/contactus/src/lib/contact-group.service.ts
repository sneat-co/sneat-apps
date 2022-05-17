import { Injectable } from '@angular/core';
import { INavContext } from '@sneat/core';


export type IContactGroupContext = INavContext<IContactGroupDto, IContactGroupDto>

export interface IContactRoleBase {
	title: string;
	emoji?: string;
	finder?: string;
}

export interface IContactRoleBrief extends IContactRoleBase {
	id: string;
}

export type IContactRoleDto = IContactRoleBase

export type IContactRoleContext = INavContext<IContactRoleBrief, IContactRoleDto>

export interface IContactGroupBase {
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
	contactTypeFriendOfKid: IContactRoleBrief = { id: 'friends', title: 'Friends', emoji: '🚸' },
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

export const defaultContactGroups: IContactGroup[] = [
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


@Injectable()
export class ContactGroupService {

}
