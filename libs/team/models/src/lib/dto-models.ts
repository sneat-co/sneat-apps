import { TeamType } from '@sneat/core';
import { IRecord } from '@sneat/data';
import { ITeamDto } from '@sneat/dto';

export interface ICreateTeamRequest {
	type: TeamType;
	// memberType: MemberType;
	title?: string;
}

export interface ICreateTeamResponse {
	team: IRecord<ITeamDto>;
}
