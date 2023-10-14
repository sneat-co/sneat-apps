import { INavContext } from '@sneat/core';
import { ITeamContext, ITeamRef } from './team-context';

export interface ITeamItemContext<Brief, Dto> extends INavContext<Brief, Dto> {
	readonly team: ITeamRef;
}

export function teamItemContextFromBrief<Brief, Dto>(
	team: ITeamContext,
	id: string,
	brief: Brief,
): ITeamItemContext<Brief, Dto> {
	return { id, brief, team };
}
