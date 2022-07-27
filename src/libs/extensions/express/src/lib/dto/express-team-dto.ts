import { INavContext } from '@sneat/core';
import { IAddress } from '@sneat/dto';
import { ITeamRequest } from '@sneat/team/models';

export type CounterpartyRole =
	'buyer' | 'consignee' | 'notify' // TODO: Which one to use/keep?
	| 'agent'
	| 'carrier'
	| 'shipper'
	| 'ship'
	| 'location'
	| 'trucker'
	| 'port_from'
	| 'port_to'
	;

export interface IExpressTeamDto {
	readonly contactID: string;
}

export interface IExpressTeamBrief extends IExpressTeamDto {
	readonly id: string;
}

export type IExpressTeamContext = INavContext<IExpressTeamBrief, IExpressTeamDto>;


export interface ISetExpressTeamSettingsRequest extends ITeamRequest {
	address: IAddress;
	vatNumber?: string;
	orderNumberPrefix?: string;
}
