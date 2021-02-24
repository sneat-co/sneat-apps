import {ITeam} from '@sneat/team';
import {IRecord} from '@sneat/data';

export interface ICreateTeamRequest {
  title: string;
}

export interface ICreateTeamResponse {
  team: IRecord<ITeam>;
}
