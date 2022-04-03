import { INavContext } from '@sneat/core';
import { ITeamContext } from './team-context';

export interface ITeamItemContext<Brief, Dto> extends INavContext<Brief, Dto> {
	readonly team?: ITeamContext;
}
