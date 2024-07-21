import { INavContext } from '@sneat/core';
import { IAddress } from '@sneat/contactus-core';
import { SpaceRequest } from '@sneat/team-models';

export type CounterpartyRole =
	| 'buyer'
	| 'consignee'
	| 'notify_party'
	// | 'freight_agent'
	| 'dispatch_agent'
	| 'receive_agent'
	| 'shipping_line'
	| 'ship'
	| 'dispatcher'
	// | 'receiver'
	| 'dispatch_point'
	| 'receive_point'
	| 'trucker'
	| 'port_from'
	| 'port_from_location'
	| 'port_to'
	| 'port_to_location';

export type LogistSpaceRole =
	| 'custom_agent'
	| 'dispatch_agent'
	| 'receive_agent'
	| 'freight_broker'
	| 'shipping_line'
	| 'trucker'
	| 'sender'
	| 'warehouse_operator';

export const LogistSpaceRoles: Record<LogistSpaceRole, string> = {
	custom_agent: 'Custom agent',
	dispatch_agent: 'Dispatch freight agent',
	receive_agent: 'Receive freight agent',
	freight_broker: 'Freight broker',
	shipping_line: 'Shipping line',
	trucker: 'Trucking company',
	sender: 'Sender (e.g. seller/factory)',
	warehouse_operator: 'Warehouse operator',
};

export interface ILogistSpaceBrief {
	readonly contactID: string;
	readonly orderNumberPrefix?: string;
}

export type ILogistSpaceDbo = ILogistSpaceBrief;

export type ILogistSpaceContext = INavContext<
	ILogistSpaceBrief,
	ILogistSpaceDbo
>;

export interface ISetLogistSpaceSettingsRequest extends SpaceRequest {
	roles: readonly string[];
	address: IAddress;
	vatNumber?: string;
	orderNumberPrefix?: string;
}
