import { Injectable, NgModule } from '@angular/core';
import {
	Firestore as AngularFirestore,
	CollectionReference,
	orderBy,
} from '@angular/fire/firestore';
import { IFilter, SneatApiService, SneatFirestoreService } from '@sneat/api';
import { ITeamContext } from '@sneat/team/models';
import { map, Observable, throwError } from 'rxjs';
import {
	IAddContainersRequest,
	IContainerRequest,
	IDeleteCounterpartyRequest,
	ICreateLogistOrderRequest,
	ICreateFreightOrderResponse,
	ILogistOrderContext,
	ILogistOrderDto,
	IFreightOrderBrief,
	ISetOrderCounterpartiesRequest,
	IAddOrderShippingPointRequest,
	IOrderCounterparty,
	IAddSegmentsRequest,
	IOrderShippingPointRequest,
	IDeleteSegmentsRequest,
	IUpdateContainerPointRequest,
	IContainerPointsRequest,
	ISetContainerPointTaskRequest,
	ISetContainerPointFreightFieldsRequest,
	IAddContainerPointsRequest,
	ISetContainerEndpointFieldsRequest,
	IUpdateShippingPointRequest,
	ISetContainerPointFieldsRequest,
	ISetContainerFieldsRequest,
} from '../dto';
import { logistTeamModuleSubCollection } from './logist-team.service';
import { IOrdersFilter } from '../dto/orders-filter';

function briefFromDto(id: string, dto: ILogistOrderDto): IFreightOrderBrief {
	return dto;
}

function contextFromDto(
	team: ITeamContext,
	id: string,
	dto: ILogistOrderDto,
): ILogistOrderContext {
	return {
		team,
		id,
		brief: briefFromDto(id, dto),
		dto,
	};
}

@Injectable()
export class LogistOrderService {
	private readonly sfs: SneatFirestoreService<
		IFreightOrderBrief,
		ILogistOrderDto
	>;

	constructor(
		private readonly sneatApiService: SneatApiService,
		// teamItemService: TeamItemBaseService,
		private readonly afs: AngularFirestore,
	) {
		this.sfs = new SneatFirestoreService<IFreightOrderBrief, ILogistOrderDto>(
			briefFromDto,
		);
	}

	createOrder(
		request: ICreateLogistOrderRequest,
	): Observable<ICreateFreightOrderResponse> {
		return this.sneatApiService.post('logistus/create_order', request);
	}

	private ordersCollection<Dto>(teamID: string): CollectionReference<Dto> {
		return logistTeamModuleSubCollection<Dto>(this.afs, teamID, 'orders');
	}

	public watchOrderByID(
		teamID: string,
		orderID: string,
	): Observable<ILogistOrderContext> {
		const ordersCollection = this.ordersCollection<ILogistOrderDto>(teamID);
		return this.sfs
			.watchByID(ordersCollection, orderID)
			.pipe(map((context) => ({ ...context, team: { id: teamID } })));
	}

	public watchFreightOrders(
		teamID: string,
		filter: IOrdersFilter,
	): Observable<ILogistOrderContext[]> {
		console.log('watchFreightOrders()', teamID, filter);
		if (!filter) {
			return throwError(() => 'filter is required parameter');
		}
		const ordersCollection = this.ordersCollection<ILogistOrderDto>(teamID);

		const qFilter: IFilter[] = [
			{ field: 'status', operator: '==', value: filter?.status || 'active' },
		];
		if (filter?.direction) {
			qFilter.push({
				field: 'direction',
				operator: '==',
				value: filter.direction,
			});
		}

		let keysVal = '';
		if (filter?.countryID) {
			keysVal = 'country=' + filter.countryID;
		}
		if (filter?.contactID) {
			if (keysVal) {
				keysVal += '&';
			}
			let contactID = filter.contactID;
			if (contactID.includes(':')) {
				contactID = contactID.split(':')[1];
			}
			if (contactID) {
				keysVal += 'contact=' + contactID;
			}
		}
		if (filter?.refNumber) {
			if (keysVal) {
				keysVal += '&';
			}
			keysVal += 'refNumber=' + filter.refNumber;
		}
		if (keysVal) {
			qFilter.push({
				field: 'keys',
				operator: 'array-contains',
				value: keysVal,
			});
		}

		const result = this.sfs
			.watchByFilter(ordersCollection, qFilter, [orderBy('createdAt', 'desc')])
			.pipe(
				map((orders) =>
					orders.map((order) => ({ ...order, team: { id: teamID } })),
				),
			);
		return result;
	}

	setOrderStatus(request: {
		teamID: string;
		orderID: string;
		status: string;
	}): Observable<void> {
		if (!request.teamID) {
			return throwError(() => 'teamID is required parameter');
		}
		if (!request.orderID) {
			return throwError(() => 'orderID is required parameter');
		}
		if (!request.status) {
			return throwError(() => 'status is required parameter');
		}
		return this.sneatApiService.post(
			'logistus/order/set_order_status',
			request,
		);
	}

	setOrderCounterparties(
		request: ISetOrderCounterpartiesRequest,
	): Observable<IOrderCounterparty> {
		return this.sneatApiService.post(
			'logistus/order/set_order_counterparties',
			request,
		);
	}

	addContainerPoints(request: IAddContainerPointsRequest): Observable<void> {
		return this.sneatApiService.post(
			'logistus/order/add_container_points',
			request,
		);
	}

	addShippingPoint(
		team: ITeamContext,
		request: IAddOrderShippingPointRequest,
	): Observable<ILogistOrderContext> {
		if (!request) {
			return throwError(() => 'request is required parameter');
		}
		if (!request.orderID) {
			return throwError(() => 'orderID is required parameter');
		}
		return this.sneatApiService
			.post<{ order: ILogistOrderDto }>(
				'logistus/order/add_shipping_point',
				request,
			)
			.pipe(
				map((response) =>
					contextFromDto(team, request.orderID, response.order),
				),
			);
	}

	updateShippingPoint(request: IUpdateShippingPointRequest): Observable<void> {
		return this.sneatApiService.post(
			'logistus/order/update_shipping_point',
			request,
		);
	}

	addContainers(request: IAddContainersRequest): Observable<void> {
		return this.sneatApiService.post('logistus/order/add_containers', request);
	}

	addSegments(request: IAddSegmentsRequest): Observable<void> {
		return this.sneatApiService.post('logistus/order/add_segments', request);
	}

	updateContainerPoint(
		request: IUpdateContainerPointRequest,
	): Observable<void> {
		return this.sneatApiService.post(
			'logistus/order/update_container_point',
			request,
		);
	}

	deleteContainer(request: IContainerRequest): Observable<void> {
		return this.sneatApiService.delete(
			'logistus/order/delete_container',
			undefined,
			request,
		);
	}

	deleteContainerPoints(request: IContainerPointsRequest): Observable<void> {
		return this.sneatApiService.delete(
			'logistus/order/delete_container_points',
			undefined,
			request,
		);
	}

	setContainerPointTask(
		request: ISetContainerPointTaskRequest,
	): Observable<void> {
		return this.sneatApiService.post(
			'logistus/order/set_container_point_task',
			request,
		);
	}

	setContainerPointFreightFields(
		request: ISetContainerPointFreightFieldsRequest,
	): Observable<void> {
		return this.sneatApiService.post(
			'logistus/order/set_container_point_freight_fields',
			request,
		);
	}

	setContainerEndpointFields(
		request: ISetContainerEndpointFieldsRequest,
	): Observable<void> {
		return this.sneatApiService.post(
			'logistus/order/set_container_endpoint_fields',
			request,
		);
	}

	setContainerFields(request: ISetContainerFieldsRequest): Observable<void> {
		return this.sneatApiService.post(
			'logistus/order/set_container_fields',
			request,
		);
	}

	setContainerPointFields(
		request: ISetContainerPointFieldsRequest,
	): Observable<void> {
		return this.sneatApiService.post(
			'logistus/order/set_container_point_fields',
			request,
		);
	}

	deleteCounterparty(request: IDeleteCounterpartyRequest): Observable<void> {
		return this.sneatApiService.delete(
			'logistus/order/delete_order_counterparty',
			undefined,
			request,
		);
	}

	deleteSegments(request: IDeleteSegmentsRequest): Observable<void> {
		if (
			!request.containerIDs?.length &&
			!request.fromShippingPointID &&
			!request.toShippingPointID &&
			!request.byContactID
		) {
			return throwError(() => new Error('empty request'));
		}
		return this.sneatApiService.delete(
			'logistus/order/delete_segments',
			undefined,
			request,
		);
	}

	deleteShippingPoint(request: IOrderShippingPointRequest): Observable<void> {
		return this.sneatApiService.delete(
			'logistus/order/delete_shipping_point',
			undefined,
			request,
		);
	}
}

@NgModule({
	imports: [],
	providers: [LogistOrderService],
})
export class LogistOrderServiceModule {}
