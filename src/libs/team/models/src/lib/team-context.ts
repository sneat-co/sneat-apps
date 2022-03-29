// import { ITeam } from "./models";

import { INavContext } from '@sneat/core';
import { ITeam, ITeamBrief } from './models';
import { TeamType } from '@sneat/dto';

export interface ITeamContext extends INavContext<ITeamBrief, ITeam> {
	type?: TeamType;
};
