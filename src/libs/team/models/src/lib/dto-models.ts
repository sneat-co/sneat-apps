import { ITeam, TeamType } from './models';
import { IRecord } from '@sneat/data';

export interface ICreateTeamRequest {
	type: TeamType;
	title?: string;
}

export interface ICreateTeamResponse {
	team: IRecord<ITeam>;
}
