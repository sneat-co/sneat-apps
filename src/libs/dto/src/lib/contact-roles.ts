export type ContactRoleInsurer = 'insurer';
export type ContactRoleFriend = 'friend';
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
export type ContactRoleVehicle = ContactRoleInsurer | 'mechanic' | 'electrician' | 'handyman';
export type ContactRoleMedRelated = 'GP' | 'med_specialist'
export type ContactRoleFamilyRelated = ContactRoleFriend;
export type ContactRoleKidRelated = ContactRoleFriend | 'teacher' | 'babysitter';
export type ContactRoleShip = 'ship';
export type ContactRoleLogistSubContact = ContactRoleShip | ContactRoleLocation;
export type ContactRoleLogistParentContact = 'shipper' | 'dispatcher';
export type LogistOrderContactRole =
	ContactRoleLogistParentContact
	| ContactRoleLogistSubContact
	| 'consignee'
	| 'notify'
	| 'dispatch-point'
	| 'agent'
	| 'buyer'
	| 'courier'
	| 'carrier'
	| 'port'
	| 'trucker'
	;
export type ContactRole =
	ContactRoleFamilyRelated |
	ContactRoleKidRelated |
	ContactRoleMedRelated |
	ContactRoleDwellingRelated |
	ContactRoleVehicle |
	LogistOrderContactRole |
	'applicant';
