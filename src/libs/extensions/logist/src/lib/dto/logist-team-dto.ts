import { INavContext } from '@sneat/core';
import { IAddress } from '@sneat/dto';
import { ITeamRequest } from '@sneat/team/models';

export type CounterpartyRole =
	'buyer' | 'consignee' | 'notify' // TODO: Which one to use/keep?
	| 'agent'
	| 'carrier'
	| 'shipper'
	| 'ship'
	| 'dispatcher'
	| 'receiver'
	| 'dispatch_point'
	| 'receive_point'
	| 'trucker'
	| 'port_from'
	| 'port_from_location'
	| 'port_to'
	| 'port_to_location'
	;

export interface ILogistTeamDto {
	readonly contactID: string;
}

export interface ILogistTeamBrief extends ILogistTeamDto {
	readonly id: string;
}

export type ILogistTeamContext = INavContext<ILogistTeamBrief, ILogistTeamDto>;


export interface ISetLogistTeamSettingsRequest extends ITeamRequest {
	address: IAddress;
	vatNumber?: string;
	orderNumberPrefix?: string;
}
