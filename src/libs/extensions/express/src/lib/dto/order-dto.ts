import { IAddress, IWithModified } from '@sneat/dto';
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
	readonly specialInstructions?: string;
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
	readonly volumeM3?: number; // 1m3 = 1000L
	readonly note?: string;
}

export interface IOrderContainerBase extends IFreightLoad {
	readonly type: ContainerType;
	readonly number: string;
}

export type ShippingPointStatus = 'pending' | 'completed';

export interface IShippingPointBase {
	readonly status: ShippingPointStatus;
	started?: string;
	completed?: string;
	scheduledStartDate?: string;
	scheduledEndDate?: string;
	toLoad?: IFreightLoad;
	toUnload?: IFreightLoad;
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

export interface IContainerPoint extends IShippingPointBase {
	readonly containerID: string;
	readonly shippingPointID: string;
	readonly arrivesDate?: string;
	readonly departsDate?: string;
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

export function getSegmentCounterparty(orderDto?: ILogistOrderDto | null, segment?: IContainerSegment): IOrderCounterparty | undefined {
	const contactID = segment?.byContactID;
	return contactID ? orderDto?.counterparties?.find(c => c.contactID === contactID) : undefined;
}

export interface ILogistOrderDto extends IFreightOrderBase, IWithModified {
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
	readonly containerPoints?: ReadonlyArray<IContainerPoint>;
	readonly segments?: ReadonlyArray<IContainerSegment>;
	readonly declarations?: IFreightDeclaration[];
	readonly specialInstructions?: string;
	readonly issued?: IDocIssued;
}

export interface ILogistOrderBrief extends IFreightOrderBase {
	id: string;
}

export type ILogistOrderContext = ITeamItemContext<ILogistOrderBrief, ILogistOrderDto>;

export interface ICreateLogistOrderRequest extends ITeamRequest {
	readonly numberOfContainers?: { [size: string]: number };
	readonly order: ILogistOrderDto;
}

export interface ICreateFreightOrderResponse {
	readonly order: { id: string };
}

export interface ILogistOrderRequest extends ITeamRequest {
	readonly orderID: string;
}

export interface ISetOrderCounterparty {
	readonly contactID: string;
	readonly role: string;
	readonly refNumber?: string;
	readonly specialInstructions?: string;
}

export interface ISetOrderCounterpartiesRequest extends ILogistOrderRequest {
	counterparties: ISetOrderCounterparty[];
}

export interface IAddOrderShippingPointRequest extends ILogistOrderRequest {
	readonly type: 'pick' | 'drop';
	readonly locationContactID: string;
	readonly containerIDs?: ReadonlyArray<string>;
}

export interface INewContainer extends IOrderContainerBase {
	readonly shippingPointIDs?: ReadonlyArray<string>;
}

export interface IAddContainersRequest extends ILogistOrderRequest {
	readonly containers: INewContainer[];
}

export interface ISegmentCounterparty {
	readonly contactID: string;
	readonly role: CounterpartyRole;
	readonly refNumber?: string;
}

export interface ISegmentEndpoint extends ISegmentCounterparty {
	readonly shippingPointID?: string;
}

export interface IOrderSegmentKey {
	readonly from: ISegmentEndpoint;
	readonly to: ISegmentEndpoint;
	readonly byContactID?: string;
}

export interface IOrderSegment extends IOrderSegmentKey {
	containerSegments: ReadonlyArray<IContainerSegment>;
}

function groupBy<T>(x: ReadonlyArray<T>, f: (v: T) => string): { [id: string]: ReadonlyArray<T> } {
	return x.reduce((a: { [id: string]: T[] }, b: T) => ((a[f(b)] ||= []).push(b), a), {});
}

export function getOrderSegments(segments?: ReadonlyArray<IContainerSegment>): IOrderSegment[] {
	if (!segments) {
		return [];
	}
	const groups = groupBy(segments, s =>
		`${s.from.role}-${s.from.contactID}-${s.to.role}-${s.to.contactID}-${s.byContactID}`);
	const entries = Object.entries(groups);
	const result = entries.map(
		([, s]) => ({
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
	readonly toLoad?: IFreightLoad;
	readonly toUnload?: IFreightLoad;
}

export interface IAddSegmentParty {
	counterparty: ISegmentCounterparty;
	refNumber?: string;
}

export interface IAddSegmentEndpoint extends IAddSegmentParty {
	date?: string;
}

export interface IAddSegmentsRequest extends ILogistOrderRequest {
	readonly from: IAddSegmentEndpoint;
	readonly to: IAddSegmentEndpoint;
	readonly by?: IAddSegmentParty;
	readonly containers: INewSegmentContainer[];
}

export interface IUpdateShippingPointRequest extends ILogistOrderRequest {
	readonly shippingPointID: string;
	readonly setNumbers: { [field: string]: number };
}


export interface IContainerRequest extends ILogistOrderRequest {
	readonly containerID: string;
}

export interface IContainerPointsRequest extends ILogistOrderRequest {
	containerID: string;
	shippingPointIDs: string[];
}

export interface IOrderShippingPointRequest extends ILogistOrderRequest {
	readonly shippingPointID: string;
}

export interface IUpdateContainerPointRequest extends IOrderShippingPointRequest, IContainerRequest {
	readonly toLoad?: IFreightLoad;
	readonly toUnload?: IFreightLoad;
	readonly arrivesDate?: string; // Pass empty string to clear date
	readonly departsDate?: string; // Pass empty string to clear date
}

// export interface IUpdateSegmentDateRequest extends IContainerRequest {
// 	readonly date: string;
// }
//
// export interface IUpdateSegmentDatesRequest extends IExpressOrderRequest {
// 	points: IUpdateSegmentDateRequest[];
// }


export interface IDeleteCounterpartyRequest extends ILogistOrderRequest, IContactRequest {
	readonly role: string;
}

export interface IDeleteSegmentsRequest extends ILogistOrderRequest {
	containerIDs?: string[];
	fromShippingPointID?: string;
	toShippingPointID?: string;
	byContactID?: string;
}
