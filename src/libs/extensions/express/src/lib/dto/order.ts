import { INavContext } from '@sneat/core';
import { ContactRoleExpress } from '@sneat/dto';
import { IContactRequest } from '@sneat/extensions/contactus';
import { ITeamRequest } from '@sneat/team/models';

export interface IFreightAddress {
	countryID: string;
	city?: string;
	zip?: string;
	text: string;
}

export interface IOrderCounterparty {
	contactID: string;
	role: ContactRoleExpress;
	refNumber?: string;
	countryID: string;
	title: string;
	phone?: string;
	email?: string;
	address?: string;
}

export type ContainerType = 'unknown' | '20ft' | '40ft';

export type FreightFlag = 'hazardous' | 'letter_of_credit';

export interface IFreightOrderLoad {
	flags?: FreightFlag[];
	grossWeightKg?: number;
	pallets?: number;
	volumeM3?: number;
}

export interface IFreightContainerBase extends IFreightOrderLoad {
	type: ContainerType;
	number: string;
}

export interface IFreightContainer extends IFreightContainerBase {
	id: string;
}

export interface IFreightDeclaration {
	number: string;
	type: 'export' | 'import';
}

export interface IDocIssued {
	at?: string;
	on?: string;
}

export interface IFreightOrderBase extends IFreightOrderLoad {
	status: string;
	direction: 'import' | 'export' | 'internal';
}

export interface IFreightOrderBrief extends IFreightOrderBase {
	id: string;
}

export interface ITransitPoint {
	id?: 'origin' | 'destination';
	countryID: string;
}

export interface IOrderRoute {
	origin?: ITransitPoint;
	destination?: ITransitPoint;
}

export interface IExpressOrderDto extends IFreightOrderBase {
	counterparties?: IOrderCounterparty[];
	route?: IOrderRoute;
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
	containers?: IFreightContainer[];
	declarations?: IFreightDeclaration[];
	specialInstructions?: string;
	issued?: IDocIssued;
}

export type IExpressOrderContext = INavContext<IExpressOrderDto, IExpressOrderDto>;

export interface ICreateExpressOrderRequest extends ITeamRequest {
	order: IExpressOrderDto;
}

export interface ICreateFreightOrderResponse {
	order: { id: string };
}

export interface IExpressOrderRequest extends ITeamRequest {
	orderID: string;
}

export interface ISetOrderCounterpartyRequest extends IExpressOrderRequest {
	contactID: string;
	role: string;
	refNumber?: string;
}

export interface IAddContainersRequest extends IExpressOrderRequest {
	containers: IFreightContainerBase[];
}

export interface IContainerRequest extends IExpressOrderRequest {
	containerID: string;
}
