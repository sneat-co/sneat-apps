import { ITeamRequest } from '@sneat/team/models';

export interface IContactRequest extends ITeamRequest {
	contactID: string;
}
