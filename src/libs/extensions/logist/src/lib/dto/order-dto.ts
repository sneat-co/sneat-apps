import { ContactType, IAddress, IWithModified } from '@sneat/dto';
import { IContactRequest } from '@sneat/contactus/shared';
import { ITeamItemContext, ITeamRequest } from '@sneat/team/models';
import { CounterpartyRole } from './logist-team-dto';
import { OrderDirection } from './orders-filter';

export interface IFreightAddress {
	readonly countryID: string;
	readonly city?: string;
	readonly zip?: string;
	readonly text: string;
}

export interface IOrderContact {
	readonly id: string;
	readonly parentID?: string;
	readonly type: ContactType;
	readonly title: string;
	// readonly countryID: string;
	// readonly address: IAddress;
}

export interface ICounterpartyParent {
	readonly contactID: string;
	readonly role: CounterpartyRole;
}

export interface IOrderCounterparty {
	readonly contactID: string;
	readonly role: CounterpartyRole;
	readonly parent?: ICounterpartyParent;
	readonly refNumber?: string;
	// readonly specialInstructions?: string;
	readonly countryID: string;
	readonly title: string;
	readonly address?: IAddress; // TODO: to be deleted as moved to IOrderContact
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

export interface IFreightPoint {
	readonly tasks: readonly ShippingPointTask[];
	readonly toLoad?: IFreightLoad;
	readonly toUnload?: IFreightLoad;
}

export interface IOrderContainerBase {
	readonly type: ContainerType;
	readonly number?: string;
	readonly instructions?: string;
}

export type ShippingPointStatus = 'pending' | 'completed';

export interface IShippingPointBase extends IFreightPoint {
	readonly status: ShippingPointStatus;
	readonly started?: string;
	readonly completed?: string;
	readonly scheduledStartDate?: string; // Date of the 1st container to arrive
	readonly scheduledEndDate?: string; // Date of the last container to depart
	readonly notes?: string;
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

export type EndpointSide = 'arrival' | 'departure';

export type ShippingPointTask = 'load' | 'unload' | 'pick' | 'drop';

export interface IOrderShippingPoint extends IShippingPointBase {
	readonly id: string;
	readonly location: IOrderShippingPointLocation;
	readonly counterparty: IOrderCounterpartyRef;
}

export interface IContainerEndpoint {
	readonly byContactID?: string;
	readonly scheduledDate?: string;
	readonly scheduledTime?: string;
	readonly actualDate?: string;
	readonly actualTime?: string;
}

export interface IContainerPoint extends IShippingPointBase {
	readonly containerID: string;
	readonly shippingPointID: string;
	readonly arrival?: IContainerEndpoint;
	readonly departure?: IContainerEndpoint;
	readonly refNumber?: string;
}

export interface IOrderContainer extends IOrderContainerBase {
	readonly id: string;
	readonly totalLoad?: IFreightLoad; // this is calculated on clint side
	readonly totalUnload?: IFreightLoad; // this is calculated on clint side
}

export interface IFreightDeclaration {
	readonly number: string;
	readonly type: OrderDirection;
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


export function getSegmentsByContainerID(segments?: ReadonlyArray<IContainerSegment>, id?: string): IContainerSegment[] | undefined {
	return segments?.filter(s => s.containerID === id);
}

export function getSegmentCounterparty(orderDto?: ILogistOrderDto | null, segment?: IContainerSegment): IOrderCounterparty | undefined {
	const contactID = segment?.byContactID;
	return contactID ? orderDto?.counterparties?.find(c => c.contactID === contactID) : undefined;
}

export interface ILogistOrderDto extends IFreightOrderBase, IWithModified {
	readonly contacts?: ReadonlyArray<IOrderContact>;
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
	// readonly specialInstructions?: string;
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
	// readonly specialInstructions?: string;
}

export interface ISetOrderCounterpartiesRequest extends ILogistOrderRequest {
	counterparties: ISetOrderCounterparty[];
}

export interface IAddContainerPointsRequest extends ILogistOrderRequest {
	containerPoints: IContainerPoint[];
}

export interface IAddContainerPoint {
	readonly id: string;
	readonly tasks: ReadonlyArray<ShippingPointTask>;
}

export interface IAddOrderShippingPointRequest extends ILogistOrderRequest {
	readonly tasks?: ReadonlyArray<ShippingPointTask>;
	readonly locationContactID: string;
	readonly containers?: ReadonlyArray<IAddContainerPoint>;
}

export interface INewContainerPoint {
	readonly shippingPointID: string;
	readonly tasks: readonly ShippingPointTask[];
}

export interface INewContainer extends IOrderContainerBase {
	readonly points: readonly INewContainerPoint[];
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
	readonly tasks: readonly ShippingPointTask[];
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

export interface IUpdateShippingPointRequest extends IOrderShippingPointRequest {
	readonly setNumbers?: { [field: string]: number };
	readonly setStrings?: { [key in ShippingPointStringField]: (string | undefined) };
}


export interface IContainerRequest extends ILogistOrderRequest {
	readonly containerID: string;
}

export interface IContainerPointsRequest extends ILogistOrderRequest {
	containerID: string;
	shippingPointIDs: string[];
}

export interface IContainerPointRequest extends ILogistOrderRequest {
	containerID: string;
	shippingPointID: string;
}

export interface ISetContainerPointTaskRequest extends IContainerPointRequest {
	readonly task: ShippingPointTask;
	readonly value: boolean;
}

export type EndpointDateField = 'scheduledDate' | 'actualDate';
export type EndpointTimeField = 'scheduledTime' | 'actualTime';
export type ShippingPointStringField = 'notes';
export type FreightPointIntField = 'numberOfPallets' | 'grossWeightKg' | 'volumeM3';
export type FreightPointField = FreightPointIntField | EndpointDateField;

export type ContainerStringField = 'number' | 'instructions';
export type ContainerPointStringField = 'notes' | 'refNumber';

export interface ISetContainerPointFreightFieldsRequest extends IContainerPointRequest {
	readonly task: ShippingPointTask;
	readonly integers: Partial<{ [key in FreightPointIntField]: (number | undefined) }>;
}

export interface ISetContainerEndpointFieldsRequest extends IContainerPointRequest {
	readonly side: EndpointSide;
	readonly dates?: Partial<{ [key in EndpointDateField]: (string | undefined) }>;
	readonly times?: Partial<{ [key in EndpointTimeField]: (string | undefined) }>;
	readonly byContactID?: string;
}

export interface ISetContainerFieldsRequest extends IContainerRequest {
	readonly setStrings: Partial<{ [key in ContainerStringField]: string }>;
}

export interface ISetContainerPointFieldsRequest extends IContainerPointRequest {
	readonly setStrings: Partial<{ [key in ContainerPointStringField]: string }>;
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
// export interface IUpdateSegmentDatesRequest extends ILogistOrderRequest {
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
