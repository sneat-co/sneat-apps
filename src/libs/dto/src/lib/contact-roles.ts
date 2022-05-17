export type ContactRoleInsurer = 'insurer';
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
export type ContactRoleKidRelated = 'teacher' | 'babysitter';
export type ContactRole = ContactRoleKidRelated | ContactRoleMedRelated | ContactRoleDwellingRelated | ContactRoleVehicle | 'applicant';
