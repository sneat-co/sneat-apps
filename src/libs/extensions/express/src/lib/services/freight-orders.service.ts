import { Injectable, NgModule } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SneatApiService, SneatFirestoreService } from '@sneat/api';
import { map, Observable } from 'rxjs';
import {
	IAddContainersRequest,
	IContainerRequest, IDeleteCounterpartyRequest,
	ICreateExpressOrderRequest,
	ICreateFreightOrderResponse,
	IExpressOrderContext,
	IExpressOrderDto,
	IFreightOrderBrief,
	IOrderShippingPointCounterparty,
	ISetOrderCounterpartyRequest, IAddOrderShippingPointRequest, IOrderCounterparty,
} from '../dto/order-dto';
import { IOrdersFilter } from './orders-filter';


function briefFromDto(id: string, dto: IExpressOrderDto): IFreightOrderBrief {
	return {
		id,
		...dto,
	};
}

@Injectable()
export class FreightOrdersService {
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

	public watchOrderByID(teamID: string, orderID: string): Observable<IExpressOrderContext> {
		return this.afs
			.collection('teams').doc(teamID)
			.collection('modules').doc('express')
			.collection<IExpressOrderDto>('orders').doc(orderID).snapshotChanges()
			.pipe(
				map(docSnapshot => {
					return this.sfs.docSnapshotToContext(docSnapshot.payload);
				}),
				map(context => ({...context, team: {id: teamID}})),
			);
	}

	public watchFreightOrders(teamID: string, filter?: IOrdersFilter): Observable<IExpressOrderContext[]> {
		console.log('watchFreightOrders()', teamID, filter);
		const result = this.afs
			.collection('teams').doc(teamID)
			.collection('modules').doc('express')
			.collection<IExpressOrderDto>('orders',
				ref => {
					let query = ref
						.where('status', '==', filter?.status || 'active')
						// .where('userIDs', 'array-contains', 'userID')
						.orderBy('created.at', 'desc');

					let keysVal = '';
					if (filter?.countryID) {
						keysVal = 'country='+filter.countryID;
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
							keysVal += 'contact='+contactID;
						}
					}
					if (keysVal) {
						query = query.where('keys', 'array-contains', keysVal);
					}
					console.log('watchFreightOrders()', teamID, filter, query);
					return query;
				}).snapshotChanges()
			.pipe(
				map(changes => this.sfs.snapshotChangesToContext(changes)),
			);

		return result.pipe(map(orders => orders.map(o => ({...o, team: {id: teamID}}))));
	}

	setOrderCounterparty(request: ISetOrderCounterpartyRequest): Observable<IOrderCounterparty> {
		return this.sneatApiService.post('express/order/set_order_counterparties', request);
	}

	addShippingPoint(request: IAddOrderShippingPointRequest): Observable<IExpressOrderDto> {
		return this.sneatApiService.post('express/order/add_shipping_point', request);
	}

	addContainers(request: IAddContainersRequest): Observable<void> {
		return this.sneatApiService.post('express/order/add_containers', request);
	}

	deleteContainer(request: IContainerRequest): Observable<void> {
		return this.sneatApiService.delete('express/order/delete_container', undefined, request);
	}

	deleteCounterparty(request: IDeleteCounterpartyRequest): Observable<void> {
		return this.sneatApiService.delete('express/order/delete_order_counterparty', undefined, request);
	}
}

@NgModule({
	imports: [],
	providers: [
		FreightOrdersService,
	],
})
export class FreightOrdersServiceModule {
}
