import { INavContext } from '@sneat/core';
import { IUserTeamBrief, TeamType } from '@sneat/dto';
import { ITeamDto } from './models';

export interface ITeamContext extends INavContext<IUserTeamBrief, ITeamDto> {
	readonly type?: TeamType;
};
