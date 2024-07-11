import { EnumAsUnionOfKeys, SpaceType } from '@sneat/core';
import { IAvatar } from './avatar';
import { IPersonNames } from './person-names';

// Does not contain an ID as it's a key.
// Use IRecord<IUserRecord> to keep record paired with ID
export interface IUserRecord {
	readonly title: string;
	readonly countryID?: string;
	readonly email?: string;
	readonly emailIsVerified?: boolean;
	readonly avatar?: IAvatar;
	readonly teamIDs?: readonly string[];
	readonly teams?: Record<string, IUserSpaceBrief>;
	readonly names?: IPersonNames;
}

export enum TeamMemberTypeEnum {
	creator = 'creator',
	member = 'member',
	pet = 'pet',
	pupil = 'pupil',
	staff = 'staff',
}

export type TeamMemberType = EnumAsUnionOfKeys<typeof TeamMemberTypeEnum>;

export interface IUserSpaceBrief {
	readonly title: string;
	readonly type: SpaceType;
	readonly roles: string[];
	readonly userContactID: string;
}
