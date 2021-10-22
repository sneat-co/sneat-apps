import { IAvatar } from './avatar';

// Does not contains ID as it's a key.
// Use IRecord<IUserRecord> to keep record paired with ID
export interface IUserRecord {
	readonly title: string;
	readonly email?: string;
	readonly emailVerified?: boolean;
	readonly avatar?: IAvatar;
	teams?: { [id: string]: IUserTeamInfo };
}

export interface IUserTeamInfo {
	title: string;
	// retroItems?: { [type: string]: IRetroItem[] };
}

export interface IUserTeamInfoWithId extends IUserTeamInfo {
	id: string;
}
