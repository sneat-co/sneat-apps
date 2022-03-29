import { IAvatar } from './avatar';
import { TeamType } from '@sneat/team/models';

// Does not contain an ID as it's a key.
// Use IRecord<IUserRecord> to keep record paired with ID
export interface IUserRecord {
	readonly title: string;
	readonly email?: string;
	readonly emailVerified?: boolean;
	readonly avatar?: IAvatar;
	readonly teams?: IUserTeamInfo[];
}

export interface IUserTeamInfo {
	readonly id: string;
	readonly type: TeamType;
	readonly title: string;
	readonly roles?: string[];
	// retroItems?: { [type: string]: IRetroItem[] };
}
