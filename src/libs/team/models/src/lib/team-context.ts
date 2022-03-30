import { INavContext } from '@sneat/core';
import { ITeamDto, IUserTeamBrief, TeamType } from '@sneat/dto';

export interface ITeamContext extends INavContext<IUserTeamBrief, ITeamDto> {
	readonly type?: TeamType;
};
