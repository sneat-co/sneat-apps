import { INavContext } from '@sneat/core';
import { ContactRoleExpress } from '@sneat/dto';
import { ITeamRequest } from '@sneat/team/models';

export interface IFreightAddress {
	readonly countryID: string;
	readonly city?: string;
	readonly zip?: string;
	readonly text: string;
}

export interface IOrderCounterparty {
	readonly contactID: string;
	readonly role: ContactRoleExpress;
	readonly refNumber?: string;
	readonly countryID: string;
	readonly title: string;
	readonly phone?: string;
	readonly email?: string;
	readonly address?: string;
}

export type ContainerType = 'unknown' | '20ft' | '40ft';

export type FreightFlag = 'hazardous' | 'letter_of_credit';

export interface IFreightOrderLoad {
	readonly flags?: ReadonlyArray<FreightFlag>;
	readonly grossWeightKg?: number;
	readonly pallets?: number;
	readonly volumeM3?: number;
}

export interface IFreightContainerBase extends IFreightOrderLoad {
	readonly type: ContainerType;
	readonly number: string;
}

export interface IFreightContainer extends IFreightContainerBase {
	readonly id: string;
}

export interface IFreightDeclaration {
	readonly number: string;
	readonly type: 'export' | 'import';
}

export interface IDocIssued {
	readonly at?: string;
	readonly on?: string;
}

export interface IFreightOrderBase extends IFreightOrderLoad {
	readonly status: string;
	readonly direction: OrderDirection;
}

export interface IFreightOrderBrief extends IFreightOrderBase {
	readonly id: string;
}

export interface ITransitPoint {
	readonly id?: 'origin' | 'destination';
	readonly countryID: string;
}

export interface IOrderRoute {
	readonly origin?: ITransitPoint;
	readonly destination?: ITransitPoint;
}

export type OrderDirection = 'import' | 'export' | 'internal';
export interface IExpressOrderDto extends IFreightOrderBase {
	readonly counterparties?: ReadonlyArray<IOrderCounterparty>;
	readonly route?: IOrderRoute;
	// buyer?: IOrderCounterparty;
	// buyerRef?: string;
	// carrier?: IOrderCounterparty;
	// carrierRef?: string;
	// consignee?: IOrderCounterparty;
	// consigneeRef?: string;
	// shipper?: IOrderCounterparty;
	// shipperRef?: string;
	// agent?: IOrderCounterparty;
	// agentRef?: string;
	readonly containers?: ReadonlyArray<IFreightContainer>;
	readonly declarations?: IFreightDeclaration[];
	readonly specialInstructions?: string;
	readonly issued?: IDocIssued;
}

export type IExpressOrderContext = INavContext<IExpressOrderDto, IExpressOrderDto>;

export interface ICreateExpressOrderRequest extends ITeamRequest {
	readonly order: IExpressOrderDto;
}

export interface ICreateFreightOrderResponse {
	readonly order: { id: string };
}

export interface IExpressOrderRequest extends ITeamRequest {
	readonly orderID: string;
}

export interface ISetOrderCounterpartyRequest extends IExpressOrderRequest {
	readonly contactID: string;
	readonly role: string;
	readonly refNumber?: string;
}

export interface IAddContainersRequest extends IExpressOrderRequest {
	readonly containers: IFreightContainerBase[];
}

export interface IContainerRequest extends IExpressOrderRequest {
	readonly containerID: string;
}
