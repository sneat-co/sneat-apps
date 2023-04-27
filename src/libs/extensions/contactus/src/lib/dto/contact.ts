import { IAddress } from '@sneat/dto';
import { ITeamRequest } from '@sneat/team/models';

export interface IContactRequest extends ITeamRequest {
	contactID: string;
}

export interface ISetContactAddressRequest extends IContactRequest {
	address: IAddress;
}

export interface ISetContactRoleRequest extends IContactRequest {
	role: string;
	value: boolean;
}
