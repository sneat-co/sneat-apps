import { IAvatar } from '@sneat/auth-models';
import { AgeGroupID, ContactType, IName, PetKind, Gender, IAddress } from '.';

export interface IContactBase {
	readonly type: ContactType;
	readonly title?: string;
	readonly shortTitle?: string;
	readonly name?: IName;
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
