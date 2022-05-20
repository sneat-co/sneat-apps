import { IInviteToContact, ITeamRequest } from '@sneat/team/models';

export interface ICreatePersonalInviteRequest extends ITeamRequest {
	to: IInviteToContact;
	message: string;
}

export interface ICreatePersonalInviteResponse {
	invite: { id: string; pin?: string; };
}
