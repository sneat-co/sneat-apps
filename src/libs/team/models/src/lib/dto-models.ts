import { IRecord } from '@sneat/data';
import { ITeamDto, TeamType } from '@sneat/dto';

export interface ICreateTeamRequest {
	type: TeamType;
	title?: string;
}

export interface ICreateTeamResponse {
	team: IRecord<ITeamDto>;
}
