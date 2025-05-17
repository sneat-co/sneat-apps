export const GenderUndisclosed = 'undisclosed';
export const GenderUnknown = 'unknown';
export const GenderMale = 'male';
export const GenderFemale = 'female';
export const GenderOther = 'other';

export type Gender =
	| typeof GenderUndisclosed
	| typeof GenderUnknown
	| typeof GenderMale
	| typeof GenderFemale
	| typeof GenderOther;
