import { Injectable, NgModule } from '@angular/core';
import { SneatApiService } from '@sneat/api';
import { Observable } from 'rxjs';
import { ICreateFreightOrderRequest, ICreateFreightOrderResponse } from '../dto/order';


@Injectable()
export class FreightOrdersService {
	constructor(
		private readonly sneatApiService: SneatApiService,
		// teamItemService: TeamItemBaseService,
	) {
	}

	createOrder(request: ICreateFreightOrderRequest): Observable<ICreateFreightOrderResponse> {
		request.order.buyer
		return this.sneatApiService.post('express/create_order', request)
	}
}

@NgModule({
	imports: [
	],
	providers: [
		FreightOrdersService,
	]
})
export class FreightOrdersServiceModule {

}
