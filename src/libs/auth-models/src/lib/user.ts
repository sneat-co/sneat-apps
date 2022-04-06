import { IAvatar } from './avatar';

// Does not contain an ID as it's a key.
// Use IRecord<IUserRecord> to keep record paired with ID
export interface IUserRecord {
	readonly title: string;
	readonly email?: string;
	readonly emailIsVerified?: boolean;
	readonly avatar?: IAvatar;
	readonly teams?: IUserTeamInfo[];
}

export type TeamType = 'family' | 'personal' | 'company' | 'team' | 'educator' | 'realtor' | 'sport_club' | 'cohabit' | 'unknown';
export type MemberType = 'member' | 'pupil' | 'staff';

export interface IUserTeamInfo {
	readonly id: string;
	readonly type: TeamType;
	readonly title: string;
	// retroItems?: { [type: string]: IRetroItem[] };
}
