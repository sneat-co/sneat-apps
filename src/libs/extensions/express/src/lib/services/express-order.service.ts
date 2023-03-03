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
	ICreateExpressOrderRequest,
	ICreateFreightOrderResponse,
	IExpressOrderContext,
	IExpressOrderDto,
	IFreightOrderBrief,
	ISetOrderCounterpartiesRequest,
	IAddOrderShippingPointRequest,
	IOrderCounterparty,
	IAddSegmentsRequest,
	IOrderShippingPointRequest,
	IDeleteSegmentsRequest,
	IUpdateContainerPointRequest,
} from '../dto';
import { expressTeamModuleSubCollection } from './express-team.service';
import { IOrdersFilter } from './orders-filter';


function briefFromDto(id: string, dto: IExpressOrderDto): IFreightOrderBrief {
	return {
		id,
		...dto,
	};
}

function contextFromDto(team: ITeamContext, id: string, dto: IExpressOrderDto): IExpressOrderContext {
	return {
		team,
		id,
		brief: briefFromDto(id, dto),
		dto,
	};
}

@Injectable()
export class ExpressOrderService {
	private readonly sfs: SneatFirestoreService<IFreightOrderBrief, IExpressOrderDto>;

	constructor(
		private readonly sneatApiService: SneatApiService,
		// teamItemService: TeamItemBaseService,
		private readonly afs: AngularFirestore,
	) {
		this.sfs = new SneatFirestoreService<IFreightOrderBrief, IExpressOrderDto>(
			'express_orders', afs, briefFromDto);
	}

	createOrder(request: ICreateExpressOrderRequest): Observable<ICreateFreightOrderResponse> {
		return this.sneatApiService.post('express/create_order', request);
	}

	private ordersCollection<Dto>(teamID: string): CollectionReference<Dto> {
		return expressTeamModuleSubCollection<Dto>(this.afs, teamID, 'orders');
	}

	public watchOrderByID(teamID: string, orderID: string): Observable<IExpressOrderContext> {
		const ordersCollection = this.ordersCollection<IExpressOrderDto>(teamID);
		return this.sfs.watchByID(ordersCollection, orderID).pipe(
			map(context => ({ ...context, team: { id: teamID } })),
		);
	}

	public watchFreightOrders(teamID: string, filter: IOrdersFilter): Observable<IExpressOrderContext[]> {
		console.log('watchFreightOrders()', teamID, filter);
		if (!filter) {
			return throwError(() => 'filter is required parameter');
		}
		const ordersCollection = this.ordersCollection<IExpressOrderDto>(teamID);

		const qFilter: IFilter[] = [
			{ field: 'status', operator: '==', value: filter?.status || 'active' }
		];
		if (filter?.direction) {
			qFilter.push({ field: 'direction', operator: '==', value: filter.direction });
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
			qFilter.push({ field: 'keys', operator: 'array-contains', value: keysVal });
		}

		const result = this.sfs.watchByFilter(ordersCollection, qFilter,
			[orderBy('createdAt', 'desc')],
		).pipe(
			map(orders => orders.map(order => ({ ...order, team: { id: teamID } }))),
		);
		return result;
	}

	setOrderStatus(request: { teamID: string, orderID: string, status: string }): Observable<void> {
		if (!request.teamID) {
			return throwError(() => 'teamID is required parameter');
		}
		if (!request.orderID) {
			return throwError(() => 'orderID is required parameter');
		}
		if (!request.status) {
			return throwError(() => 'status is required parameter');
		}
		return this.sneatApiService.post('express/order/set_order_status', request);
	}

	setOrderCounterparties(request: ISetOrderCounterpartiesRequest): Observable<IOrderCounterparty> {
		return this.sneatApiService.post('express/order/set_order_counterparties', request);
	}

	addShippingPoint(team: ITeamContext, request: IAddOrderShippingPointRequest): Observable<IExpressOrderContext> {
		return this.sneatApiService
			.post<{ order: IExpressOrderDto }>('express/order/add_shipping_point', request)
			.pipe(
				map(response => contextFromDto(team, request.orderID, response.order)),
			);
	}

	addContainers(request: IAddContainersRequest): Observable<void> {
		return this.sneatApiService.post('express/order/add_containers', request);
	}

	addSegments(request: IAddSegmentsRequest): Observable<void> {
		return this.sneatApiService.post('express/order/add_segments', request);
	}

	updateContainerPoint(request: IUpdateContainerPointRequest): Observable<void> {
		return this.sneatApiService.post('express/order/update_container_point', request);
	}

	deleteContainer(request: IContainerRequest): Observable<void> {
		return this.sneatApiService.delete('express/order/delete_container', undefined, request);
	}

	deleteCounterparty(request: IDeleteCounterpartyRequest): Observable<void> {
		return this.sneatApiService.delete('express/order/delete_order_counterparty', undefined, request);
	}

	deleteSegments(request: IDeleteSegmentsRequest): Observable<void> {
		if (!request.containerIDs?.length && !request.from && !request.to && !request.by) {
			return throwError(() => new Error('empty request'));
		}
		return this.sneatApiService.delete('express/order/delete_segments', undefined, request);
	}

	deleteShippingPoint(request: IOrderShippingPointRequest): Observable<void> {
		return this.sneatApiService.delete('express/order/delete_shipping_point', undefined, request);
	}
}

@NgModule({
	imports: [],
	providers: [
		ExpressOrderService,
	],
})
export class ExpressOrderServiceModule {
}
