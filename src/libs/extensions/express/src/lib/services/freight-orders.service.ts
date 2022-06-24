import { Injectable, NgModule } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { SneatApiService, SneatFirestoreService } from '@sneat/api';
import firebase from 'firebase/compat';
import { map, Observable } from 'rxjs';
import {
	ICreateFreightOrderRequest,
	ICreateFreightOrderResponse,
	IExpressOrderContext, IOrderCounterparty,
	IFreightOrderBrief,
	IFreightOrderDto,
	ISetOrderCounterpartyRequest,
} from '../dto/order';
import DocumentSnapshot = firebase.firestore.DocumentSnapshot;


function briefFromDto(id: string, dto: IFreightOrderDto): IFreightOrderBrief {
	return {
		id,
		...dto,
	};
}

@Injectable()
export class FreightOrdersService {
	private readonly sfs: SneatFirestoreService<IFreightOrderBrief, IFreightOrderDto>;

	constructor(
		private readonly sneatApiService: SneatApiService,
		// teamItemService: TeamItemBaseService,
		private readonly afs: AngularFirestore,
	) {
		this.sfs = new SneatFirestoreService<IFreightOrderBrief, IFreightOrderDto>(
			'express_orders', afs, briefFromDto);
	}

	createOrder(request: ICreateFreightOrderRequest): Observable<ICreateFreightOrderResponse> {
		request.order.buyer;
		return this.sneatApiService.post('express/create_order', request);
	}

	public watchOrderByID(teamID: string, orderID: string): Observable<IExpressOrderContext> {
		return this.afs
			.collection('express_teams').doc(teamID)
			.collection<IFreightOrderDto>('orders').doc(orderID).snapshotChanges()
			.pipe(
				map(docSnapshot => {
					return this.sfs.docSnapshotToContext(docSnapshot.payload)
				}),
			);
	}

	private ordersCollection(teamID: string) {
		return
	}

	public watchFreightOrders(teamID: string): Observable<IExpressOrderContext[]> {
		console.log('watchFreightOrders()', teamID);
		return this.afs
			.collection('express_teams').doc(teamID)
			.collection<IFreightOrderDto>('orders',
				ref => ref
					.where('status', '==', 'draft')
					.orderBy('created.at', 'desc'))
			.snapshotChanges()
			.pipe(
				map(changes => this.sfs.snapshotChangesToContext(changes)),
			);
	}

	setOrderCounterparty(request: ISetOrderCounterpartyRequest): Observable<IOrderCounterparty> {
		return this.sneatApiService.post('express/order/set_order_counterparty', request);
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
