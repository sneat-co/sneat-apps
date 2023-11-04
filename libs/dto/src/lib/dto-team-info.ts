import { TeamType } from '@sneat/core';
import { IUserCommuneInfo } from '.';

export interface IShortTeamInfo {
	type: TeamType;
	id?: string;
	// shortId?: CommuneShortId;
	title?: string;
}

export function createShortCommuneInfoFromUserCommuneInfo(
	v: IUserCommuneInfo,
): IShortTeamInfo {
	return { id: v.id, title: v.title, /*shortId: v.shortId,*/ type: v.type };
}
