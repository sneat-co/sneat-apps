import { EnumAsUnionOfKeys, SpaceType } from '@sneat/core';
import { IAvatar } from './avatar';
import { IPersonNames } from './person-names';

// Does not contain an ID as it's a key.
// Use IRecord<IUserRecord> to keep record paired with ID
export interface IUserRecord {
	readonly accounts?: string[];
	readonly title: string;
	readonly countryID?: string;
	readonly email?: string;
	readonly emailIsVerified?: boolean;
	readonly avatar?: IAvatar;
	readonly spaceIDs?: readonly string[];
	readonly spaces?: Record<string, IUserSpaceBrief>;
	readonly names?: IPersonNames;
}

export enum SpaceMemberTypeEnum {
	creator = 'creator',
	member = 'member',
	pet = 'pet',
	pupil = 'pupil',
	staff = 'staff',
}

export type SpaceMemberType = EnumAsUnionOfKeys<typeof SpaceMemberTypeEnum>;

export interface IUserSpaceBrief {
	readonly title: string;
	readonly type: SpaceType;
	readonly roles: string[];
	readonly userContactID: string;
}
