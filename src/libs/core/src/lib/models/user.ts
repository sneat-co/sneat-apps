import {IAvatar} from './avatar';

export interface IUser {
	readonly title: string;
	readonly email?: string;
	readonly emailVerified?: boolean;
	readonly avatar?: IAvatar;
}
