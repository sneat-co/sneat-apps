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

export type LogistTeamRole =
	'custom_agent' |
	'freight_agent' |
	'freight_broker' |
	'shipping_line' |
	'trucker' |
	'sender' |
	'warehouse_operator';

export const LogistTeamRoles: Record<LogistTeamRole, string> = {
	'custom_agent': 'Custom agent',
	'freight_agent': 'Freight agent',
	'freight_broker': 'Freight broker',
	'shipping_line': 'Shipping line',
	'trucker': 'Trucking company',
	'sender': 'Sender (e.g. seller/factory)',
	'warehouse_operator': 'Warehouse operator',
};

export interface ILogistTeamDto {
	readonly contactID: string;
	readonly orderNumberPrefix?: string;
}

export interface ILogistTeamBrief extends ILogistTeamDto {
	readonly id: string;
}

export type ILogistTeamContext = INavContext<ILogistTeamBrief, ILogistTeamDto>;


export interface ISetLogistTeamSettingsRequest extends ITeamRequest {
	roles: string[];
	address: IAddress;
	vatNumber?: string;
	orderNumberPrefix?: string;
}
