import { INavContext } from '@sneat/core';
import { ITeamDto, ITeamBrief, TeamType } from '@sneat/dto';

export interface ITeamContext extends INavContext<ITeamBrief, ITeamDto> {
	readonly type?: TeamType;
};
