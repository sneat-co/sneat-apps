import { IInviteTeam } from '@sneat/team-models';
import { IMemberBrief } from '../dto';
import { IInviteFromContact, IInviteToContact } from './requests';

export interface IJoinTeamInfoResponse {
	team: IInviteTeam;
	invite: {
		id: string;
		pin: string;
		status: string;
		created: string;
		from: IInviteFromContact;
		to: IInviteToContact;
		message?: string;
	};
	member: IMemberBrief;
}

export interface ICreatePersonalInviteResponse {
	invite: { id: string; pin?: string };
}
