import { IAvatar, IPersonNames } from '@sneat/auth-models';
import { IWithRelatedOnly } from '@sneat/dto';
import { IAddress } from './address';

import { ContactType, IEmail, IPhone } from './contact-types';
import { Gender } from './gender';
import { AgeGroupID } from './age-group';
import { PetKind } from './pet-kind';

// import { AgeGroupID, ContactType, PetKind, Gender, IAddress } from '.';

// Originally was in IPerson but also required by company
// and also if in IPerson troubles with Person Wizard component
export interface IContactChannels {
	readonly email?: string; // TODO: Document how email is different from emails
	readonly emails?: IEmail[];
	readonly phone?: string; // TODO: Document how phone is different from phones
	readonly phones?: IPhone[];
	readonly website?: string;
}

export interface IContactBase extends IWithRelatedOnly, IContactChannels {
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
