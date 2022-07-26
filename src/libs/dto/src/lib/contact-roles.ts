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
export type ContactRoleExpressSubContact = ContactRoleShip | ContactRoleLocation;
export type ContactRoleExpressParentContact = 'shipper' | 'dispatcher';
export type ContactRoleExpress =
	ContactRoleExpressParentContact | ContactRoleExpressSubContact |
	'consignee' |
	'notify' |
	'dispatch-location' |
	'agent' |
	'buyer' |
	'courier' |
	'carrier' |
	'port';
export type ContactRole =
	ContactRoleFamilyRelated |
	ContactRoleKidRelated |
	ContactRoleMedRelated |
	ContactRoleDwellingRelated |
	ContactRoleVehicle |
	ContactRoleExpress |
	'applicant';
