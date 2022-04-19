import { IRecord } from '@sneat/data';
import { ITeamDto, MemberType, TeamType } from '@sneat/dto';

export interface ICreateTeamRequest {
	type: TeamType;
	memberType: MemberType;
	title?: string;
}

export interface ICreateTeamResponse {
	team: IRecord<ITeamDto>;
}
