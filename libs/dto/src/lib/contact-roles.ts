export const ContactRoleEmployee = 'employee';
export const ContactRoleInsurer = 'insurer';

export const ContactRoleFriend = 'friend';
export const ContactRoleRelative = 'relative';

// export type ContactRoleFriend = 'friend';
export const ContactRoleParentOfFriend = 'parent_of_friend';
export const ContactRoleDriver = 'driver';
export const ContactRoleLocation = 'location';
export type ContactRoleDwellingRelated =
	| typeof ContactRoleInsurer
	| 'cleaner'
	| 'gardener'
	| 'plumber'
	| 'handyman'
	| 'gp'
	| 'landlord'
	| 'tenant'
	| 'realtor';
export type ContactRoleVehicle =
	| typeof ContactRoleInsurer
	| 'mechanic'
	| 'electrician'
	| 'handyman'
	| typeof ContactRoleDriver;
export type ContactRoleMedRelated = 'GP' | 'med_specialist';
export type ContactRoleFamilyRelated =
	| typeof ContactRoleFriend
	| typeof ContactRoleRelative;
export type ContactRoleWorkRelated =
	| typeof ContactRoleEmployee
	| 'client'
	| 'supplier';
export type ContactRoleKidRelated =
	| typeof ContactRoleFriend
	| typeof ContactRoleParentOfFriend
	| 'teacher'
	| 'babysitter';
export const ContactRoleShip = 'ship';
export type ContactRoleLogistSubContact =
	| typeof ContactRoleShip
	| typeof ContactRoleLocation;
export type ContactRoleLogistParentContact = 'shipper' | 'dispatcher';
import { MemberRole, RoleTeamMember } from './dto-member';

export type LogistOrderContactRole =
	| ContactRoleLogistParentContact
	| ContactRoleLogistSubContact
	| 'consignee'
	| 'dispatch_point'
	| 'receive_point'
	| 'dispatch_agent'
	| 'receive_agent'
	| 'buyer'
	| 'courier'
	| 'freight_agent'
	| 'notify_party'
	| 'port'
	| 'port_from'
	| 'port_from_location'
	| 'port_to'
	| 'port_to_location'
	| 'shipping_line'
	| 'truck'
	| 'trucker'
	| 'warehouse';
export type ContactRole =
	| MemberRole
	| typeof RoleTeamMember
	| ContactRoleFamilyRelated
	| ContactRoleWorkRelated
	| ContactRoleKidRelated
	| ContactRoleMedRelated
	| ContactRoleDwellingRelated
	| ContactRoleVehicle
	| LogistOrderContactRole
	| 'applicant';

export interface IContactRoleBrief {
	title: string;
	emoji?: string;
	finder?: string;
}

export interface IContactRoleBriefWithID extends IContactRoleBrief {
	id: ContactRole;
}
