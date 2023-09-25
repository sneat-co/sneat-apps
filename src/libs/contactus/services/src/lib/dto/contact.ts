import { AgeGroupID, IAddress } from '@sneat/dto';
import { ITeamRequest } from '@sneat/team/models';

export interface IContactRequest extends ITeamRequest {
	readonly contactID: string;
}

export interface IUpdateContactRequest extends IContactRequest {
	readonly address?: IAddress;
	readonly ageGroup?: AgeGroupID;
	readonly roles?: ISetContactRolesRequest;
}

export interface ISetContactRolesRequest {
	readonly add?: readonly string[];
	readonly remove?: readonly string[];
}

