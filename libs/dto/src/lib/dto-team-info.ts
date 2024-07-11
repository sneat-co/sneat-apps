import { SpaceType } from '@sneat/core';
import { IUserCommuneInfo } from '.';

export interface IShortSpaceInfo {
	type: SpaceType;
	id?: string;
	// shortId?: CommuneShortId;
	title?: string;
}

export function createShortCommuneInfoFromUserCommuneInfo(
	v: IUserCommuneInfo,
): IShortSpaceInfo {
	return { id: v.id, title: v.title, /*shortId: v.shortId,*/ type: v.type };
}
