import { Injectable, NgModule } from '@angular/core';
import {
	CollectionReference,
	Firestore as AngularFirestore,
	orderBy,
} from '@angular/fire/firestore';
import { IFilter, SneatApiService, SneatFirestoreService } from '@sneat/api';
import { ISpaceContext } from '@sneat/team-models';
import { map, Observable, throwError } from 'rxjs';
import {
	IAddContainerPointsRequest,
	IAddContainersRequest,
	IAddOrderShippingPointRequest,
	IAddSegmentsRequest,
	IContainerPointsRequest,
	IContainerRequest,
	ICreateFreightOrderResponse,
	ICreateLogistOrderRequest,
	IDeleteCounterpartyRequest,
	IDeleteSegmentsRequest,
	IFreightOrderBrief,
	ILogistOrderContext,
	ILogistOrderDbo,
	IOrderCounterparty,
	IOrderShippingPointRequest,
	ISetContainerEndpointFieldsRequest,
	ISetContainerFieldsRequest,
	ISetContainerPointFieldsRequest,
	ISetContainerPointFreightFieldsRequest,
	ISetContainerPointTaskRequest,
	ISetOrderCounterpartiesRequest,
	IUpdateContainerPointRequest,
	IUpdateShippingPointRequest,
} from '../dto';
import { IOrdersFilter } from '../dto/orders-filter';
import { logistSpaceModuleSubCollection } from './logist-space.service';

export interface ISetOrderStatusRequest {
	spaceID: string;
	orderID: string;
	status: string;
}

function briefFromDto(id: string, dto: ILogistOrderDbo): IFreightOrderBrief {
	return dto;
}

function contextFromDto(
	space: ISpaceContext,
	id: string,
	dto: ILogistOrderDbo,
): ILogistOrderContext {
	return {
		space,
		id,
		brief: briefFromDto(id, dto),
		dbo: dto,
	};
}

@Injectable()
export class LogistOrderService {
	private readonly sfs: SneatFirestoreService<
		IFreightOrderBrief,
		ILogistOrderDbo
	>;

	constructor(
		private readonly sneatApiService: SneatApiService,
		// teamItemService: TeamItemBaseService,
		private readonly afs: AngularFirestore,
	) {
		this.sfs = new SneatFirestoreService<IFreightOrderBrief, ILogistOrderDbo>(
			briefFromDto,
		);
	}

	createOrder(
		request: ICreateLogistOrderRequest,
	): Observable<ICreateFreightOrderResponse> {
		return this.sneatApiService.post('logistus/create_order', request);
	}

	private ordersCollection<Dbo>(spaceID: string): CollectionReference<Dbo> {
		return logistSpaceModuleSubCollection<Dbo>(this.afs, spaceID, 'orders');
	}

	public watchOrderByID(
		spaceID: string,
		orderID: string,
	): Observable<ILogistOrderContext> {
		const ordersCollection = this.ordersCollection<ILogistOrderDbo>(spaceID);
		return this.sfs
			.watchByID(ordersCollection, orderID)
			.pipe(map((context) => ({ ...context, space: { id: spaceID } })));
	}

	public watchFreightOrders(
		spaceID: string,
		filter: IOrdersFilter,
	): Observable<ILogistOrderContext[]> {
		console.log('watchFreightOrders()', spaceID, filter);
		if (!filter) {
			return throwError(() => 'filter is required parameter');
		}
		const ordersCollection = this.ordersCollection<ILogistOrderDbo>(spaceID);

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

		return this.sfs
			.watchByFilter(ordersCollection, {
				filter: qFilter,
				orderBy: [orderBy('createdAt', 'desc')],
			})
			.pipe(
				map((orders) =>
					orders.map((order) => ({ ...order, space: { id: spaceID } })),
				),
			);
	}

	setOrderStatus(request: ISetOrderStatusRequest): Observable<void> {
		if (!request.spaceID) {
			return throwError(() => 'spaceID is required parameter');
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
		space: ISpaceContext,
		request: IAddOrderShippingPointRequest,
	): Observable<ILogistOrderContext> {
		if (!request) {
			return throwError(() => 'request is required parameter');
		}
		if (!request.orderID) {
			return throwError(() => 'orderID is required parameter');
		}
		return this.sneatApiService
			.post<{
				order: ILogistOrderDbo;
			}>('logistus/order/add_shipping_point', request)
			.pipe(
				map((response) =>
					contextFromDto(space, request.orderID, response.order),
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
