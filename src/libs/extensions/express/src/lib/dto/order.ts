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

export interface IFreightContainer extends IFreightOrderLoad {
	id: string;
	type: ContainerType;
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

export interface IFreightOrderDto extends IFreightOrderBase {
	counterparties?: IOrderCounterparty[];
	buyer?: IOrderCounterparty;
	buyerRef?: string;
	carrier?: IOrderCounterparty;
	carrierRef?: string;
	consignee?: IOrderCounterparty;
	consigneeRef?: string;
	shipper?: IOrderCounterparty;
	shipperRef?: string;
	agent?: IOrderCounterparty;
	agentRef?: string;
	containers?: IFreightContainer[];
	declarations?: IFreightDeclaration[];
	specialInstructions?: string;
	issued?: IDocIssued;
}

export type IExpressOrderContext = INavContext<IFreightOrderDto, IFreightOrderDto>;

export interface ICreateFreightOrderRequest extends ITeamRequest {
	order: IFreightOrderDto;
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
