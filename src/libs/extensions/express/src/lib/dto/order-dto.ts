import { INavContext } from '@sneat/core';
import { ExpressOrderContactRole, IAddress } from '@sneat/dto';
import { IContactRequest } from '@sneat/extensions/contactus';
import { ITeamItemContext, ITeamRequest } from '@sneat/team/models';
import { CounterpartyRole } from './express-team-dto';

export interface IFreightAddress {
	readonly countryID: string;
	readonly city?: string;
	readonly zip?: string;
	readonly text: string;
}

export interface IOrderCounterparty {
	readonly contactID: string;
	readonly parentContactID?: string;
	readonly role: CounterpartyRole;
	readonly refNumber?: string;
	readonly countryID: string;
	readonly title: string;
	readonly phone?: string;
	readonly email?: string;
	readonly address?: IAddress;
}

export type ContainerType = 'unknown' | '20ft' | '40ft';

export type FreightFlag = 'hazardous' | 'letter_of_credit';

export interface IFreightLoad {
	readonly flags?: ReadonlyArray<FreightFlag>;
	readonly grossWeightKg?: number;
	readonly numberOfPallets?: number;
	readonly volumeInLitters?: number; // 1m3 = 1000L
}

export interface IOrderContainerBase extends IFreightLoad {
	readonly type: ContainerType;
	readonly number: string;
}

export type ShippingPointStatus = 'pending' | 'completed';

export interface IShippingPointBase extends IFreightLoad {
	readonly status: ShippingPointStatus;
	started?: string;
	completed?: string;
	scheduledStartDate?: string;
	scheduledEndDate?: string;
}

export interface IOrderShippingPointLocation {
	readonly contactID: string;
	readonly countryID: string;
	readonly title: string;
	readonly address?: IAddress;
}

export interface IOrderCounterpartyRef {
	readonly contactID: string;
	readonly title: string;
}

export interface ISegmentDates {
	readonly start: string;
	readonly end: string;
}

export interface IContainerSegment extends IContainerSegmentKey {
	dates: ISegmentDates;
}

export interface ISegmentLegKey {
	readonly from: ISegmentEndpoint;
	readonly to: ISegmentEndpoint;
	readonly by?: ISegmentCounterparty;
}

export interface IOrderShippingPoint extends IShippingPointBase {
	readonly id: string;
	readonly type: 'pick' | 'drop'; // TODO: consider changing to or adding 'load' & 'unload';
	readonly location: IOrderShippingPointLocation;
	readonly counterparty: IOrderCounterpartyRef;
}

export interface IOrderContainer extends IOrderContainerBase {
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

export interface IFreightOrderBase extends IFreightLoad {
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

export function getSegmentsByContainerID(segments?: ReadonlyArray<IContainerSegment>, id?: string): IContainerSegment[] | undefined {
	return segments?.filter(s => s.containerID === id);
}

export function getSegmentCounterparty(orderDto?: IExpressOrderDto | null, segment?: IContainerSegment): IOrderCounterparty | undefined {
	const contactID = segment?.by?.contactID;
	return contactID ? orderDto?.counterparties?.find(c => c.contactID === contactID) : undefined;
}

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
	readonly shippingPoints?: ReadonlyArray<IOrderShippingPoint>;
	readonly containers?: ReadonlyArray<IOrderContainer>;
	readonly segments?: ReadonlyArray<IContainerSegment>;
	readonly declarations?: IFreightDeclaration[];
	readonly specialInstructions?: string;
	readonly issued?: IDocIssued;
}

export interface IExpressOrderBrief extends IFreightOrderBase {
	id: string;
}

export type IExpressOrderContext = ITeamItemContext<IExpressOrderBrief, IExpressOrderDto>;

export interface ICreateExpressOrderRequest extends ITeamRequest {
	readonly numberOfContainers?: { [size: string]: number };
	readonly order: IExpressOrderDto;
}

export interface ICreateFreightOrderResponse {
	readonly order: { id: string };
}

export interface IExpressOrderRequest extends ITeamRequest {
	readonly orderID: string;
}

export interface ISetOrderCounterparty {
	readonly contactID: string;
	readonly role: string;
	readonly refNumber?: string;
}

export interface ISetOrderCounterpartyRequest extends IExpressOrderRequest {
	counterparties: ISetOrderCounterparty[];
}

export interface IAddOrderShippingPointRequest extends IExpressOrderRequest {
	readonly type: 'pick' | 'drop';
	readonly locationContactID: string;
	readonly containerIDs?: ReadonlyArray<string>;
}

export interface INewContainer extends IOrderContainerBase {
	readonly shippingPointIDs?: ReadonlyArray<string>;
}

export interface IAddContainersRequest extends IExpressOrderRequest {
	readonly containers: INewContainer[];
}

export interface ISegmentCounterparty {
	readonly contactID: string;
	readonly role: CounterpartyRole;
}

export interface ISegmentEndpoint extends ISegmentCounterparty {
	readonly shippingPointID?: string;
}

export interface IOrderSegmentKey {
	readonly from: ISegmentEndpoint;
	readonly to: ISegmentEndpoint;
	readonly by?: ISegmentCounterparty;
}

export interface IOrderSegment extends IOrderSegmentKey {
	containerSegments: ReadonlyArray<IContainerSegment>;
}

function groupBy<T, K>(x: ReadonlyArray<T>, f: (v: T) => string): { [id: string]: ReadonlyArray<T> } {
	return x.reduce((a: { [id: string]: T[] }, b: T) => ((a[f(b)] ||= []).push(b), a), {});
}

export function getOrderSegments(segments?: ReadonlyArray<IContainerSegment>): IOrderSegment[] {
	if (!segments) {
		return [];
	}
	const groups = groupBy(segments, s =>
		`${s.from.role}-${s.from.contactID}-${s.to.role}-${s.to.contactID}-${s.by?.contactID}`);
	const entries = Object.entries(groups);
	const result = entries.map(
		([_, s]) => ({
			from: s[0].from,
			to: s[0].to,
			containerSegments: s,
		}),
	);
	return result;
}

export interface IContainerSegmentKey extends IOrderSegmentKey {
	readonly containerID: string;
}

export interface INewSegmentContainer {
	readonly id: string;
}

export interface IAddSegmentEndpoint {
	counterparty: ISegmentCounterparty;
	refNumber?: string;
	date?: string;
}

export interface IAddSegmentsRequest extends IExpressOrderRequest {
	readonly from: IAddSegmentEndpoint;
	readonly to: IAddSegmentEndpoint;
	readonly by?: ISegmentCounterparty;
	readonly byRefNumber?: string;
	readonly containers: INewSegmentContainer[];
}

export interface IUpdateShippingPointRequest extends IExpressOrderRequest {
	readonly shippingPointID: string;
	readonly setNumbers: { [field: string]: number };
}

export interface IContainerRequest extends IExpressOrderRequest {
	readonly containerID: string;
}

export interface IOrderShippingPointRequest extends IExpressOrderRequest {
	readonly shippingPointID: string;
}

export interface IDeleteCounterpartyRequest extends IExpressOrderRequest, IContactRequest {
	readonly role: string;
}

export interface IDeleteSegmentsRequest extends IExpressOrderRequest {
	containerIDs?: string[];
	from?: ISegmentCounterparty;
	to?: ISegmentCounterparty;
	by?: ISegmentCounterparty;
}
