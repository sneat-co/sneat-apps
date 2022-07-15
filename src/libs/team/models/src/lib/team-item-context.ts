import { INavContext } from '@sneat/core';
import { ITeamContext } from './team-context';

export interface ITeamItemContext<Brief extends {id: string}, Dto> extends INavContext<Brief, Dto> {
	readonly team: ITeamContext;
}

export function teamItemContextFromBrief<Brief extends {id: string}, Dto>(team: ITeamContext, brief: Brief): ITeamItemContext<Brief, Dto> {
	return {id: brief.id, brief, team};
}
