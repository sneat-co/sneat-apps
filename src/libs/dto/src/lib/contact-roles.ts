export type ContactRoleEmployee = 'employee';
export type ContactRoleInsurer = 'insurer';
export type ContactRoleFriend = 'friend';
export type ContactRoleDriver = 'driver';
export type ContactRoleLocation = 'location';
export type ContactRoleDwellingRelated =
	ContactRoleInsurer
	| 'cleaner'
	| 'gardener'
	| 'plumber'
	| 'handyman'
	| 'gp'
	| 'landlord'
	| 'tenant'
	| 'realtor';
export type ContactRoleVehicle = ContactRoleInsurer | 'mechanic' | 'electrician' | 'handyman' | ContactRoleDriver;
export type ContactRoleMedRelated = 'GP' | 'med_specialist'
export type ContactRoleFamilyRelated = ContactRoleFriend;
export type ContactRoleWorkRelated = ContactRoleEmployee | 'client' | 'supplier';
export type ContactRoleKidRelated = ContactRoleFriend | 'teacher' | 'babysitter';
export type ContactRoleShip = 'ship';
export type ContactRoleLogistSubContact = ContactRoleShip | ContactRoleLocation;
export type ContactRoleLogistParentContact = 'shipper' | 'dispatcher';

export type LogistOrderContactRole =
	ContactRoleLogistParentContact
	| ContactRoleLogistSubContact
	| 'consignee'
	| 'notify'
	| 'dispatch_point'
	| 'agent'
	| 'buyer'
	| 'courier'
	| 'carrier'
	| 'notify_party'
	| 'port'
	| 'shipping_line'
	| 'truck'
	| 'trucker'
	| 'warehouse'
	;
export type ContactRole =
	ContactRoleFamilyRelated |
	ContactRoleWorkRelated |
	ContactRoleKidRelated |
	ContactRoleMedRelated |
	ContactRoleDwellingRelated |
	ContactRoleVehicle |
	LogistOrderContactRole |
	'applicant';
