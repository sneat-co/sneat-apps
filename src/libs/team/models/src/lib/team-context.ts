// import { ITeam } from "./models";

import { INavContext } from '@sneat/core';
import { ITeam, ITeamBrief, TeamType } from './models';

export interface ITeamContext extends INavContext<ITeamBrief, ITeam> {
	type?: TeamType;
};
