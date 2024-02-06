import { IAvatar, IPersonNames } from '@sneat/auth-models';
import { AgeGroupID, ContactType, PetKind, Gender, IAddress } from '.';

export interface IContactBase {
	readonly type: ContactType;
	readonly title?: string;
	readonly shortTitle?: string;
	readonly name?: IPersonNames;
	readonly countryID?: string;
	readonly userID?: string;
	readonly gender?: Gender;
	readonly ageGroup?: AgeGroupID;
	readonly petKind?: PetKind;
	readonly address?: IAddress;
	readonly avatar?: IAvatar;
	readonly roles?: readonly string[];
	readonly groupIDs?: readonly string[];
	// readonly relatedAs?: string;
	readonly invitesCount?: string;
	readonly dob?: string; // Date of birth
}
