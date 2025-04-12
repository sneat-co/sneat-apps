import { IAvatar, IPersonNames } from '@sneat/auth-models';
import { IWithRelatedOnly } from '@sneat/dto';
import { IAddress } from './address';

import { ContactType } from './contact-types';
import { Gender } from './gender';
import { AgeGroupID } from './age-group';
import { PetKind } from './pet-kind';

// import { AgeGroupID, ContactType, PetKind, Gender, IAddress } from '.';

export interface IContactBase extends IWithRelatedOnly {
	readonly type: ContactType;
	readonly title?: string;
	readonly shortTitle?: string;
	readonly names?: IPersonNames;
	readonly countryID?: string;
	readonly userID?: string;
	readonly gender?: Gender;
	readonly ageGroup?: AgeGroupID;
	readonly petKind?: PetKind;
	readonly petBreed?: string;
	readonly address?: IAddress;
	readonly avatar?: IAvatar;
	readonly roles?: readonly string[];
	readonly groupIDs?: readonly string[];
	// readonly relatedAs?: string;
	readonly invitesCount?: string;
	readonly dob?: string; // Date of birth
}
