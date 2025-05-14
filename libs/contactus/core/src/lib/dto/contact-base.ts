import { IAvatar, IPersonNames } from '@sneat/auth-models';
import { IWithRelatedOnly } from '@sneat/dto';
import { IAddress } from './address';
import { ContactType } from './contact-types';
import { Gender } from './gender';
import { AgeGroupID } from './age-group';
import { PetKind } from './pet-kind';

export interface ICommunicationChannelProps {
	type: 'work' | 'personal';
	isPrimary?: boolean;
	isVerified?: boolean;
	original?: string;
}

// Originally was in IPerson but also required by company
// and also if in IPerson troubles with Person Wizard component
export interface IContactChannels {
	readonly email?: string; // TODO: Document how email is different from emails
	readonly emails?: Readonly<Record<string, ICommunicationChannelProps>>;

	readonly phone?: string; // TODO: Document how phone is different from phones
	readonly phones?: Readonly<Record<string, ICommunicationChannelProps>>;
}

// This is used to pass to create_contact API endpoint
// as IContactDbo have required fields
// that are not needed at client side at time of creation.
export interface IContactBase extends IWithRelatedOnly, IContactChannels {
	readonly type: ContactType;
	readonly title?: string;
	readonly shortTitle?: string;
	readonly names?: IPersonNames;
	readonly countryID?: string;
	readonly userID?: string;
	readonly gender?: Gender; // is required for contact "person" and "animal" type, for others it should be `undefined`
	readonly ageGroup?: AgeGroupID;
	readonly petKind?: PetKind;
	readonly petBreed?: string;
	readonly address?: IAddress;
	readonly avatar?: IAvatar;
	readonly roles?: readonly string[];
	readonly groupIDs?: readonly string[];
	readonly invitesCount?: string;
	readonly dob?: string; // Date of birth
}
