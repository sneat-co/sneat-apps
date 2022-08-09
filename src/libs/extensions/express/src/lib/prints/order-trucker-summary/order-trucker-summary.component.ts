import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContactService } from '@sneat/extensions/contactus';
import { ExpressOrderService, IExpressOrderContext, IOrderCounterparty } from '../..';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { OrderPrintPageBaseComponent } from '../order-print-page-base.component';

@Component({
	selector: 'sneat-print-order-trucker-summary',
	templateUrl: './order-trucker-summary.component.html',
})
export class OrderTruckerSummaryComponent extends OrderPrintPageBaseComponent {

	truckerID?: string;
	truckerCounterparty?: IOrderCounterparty;
	selfCounterparty?: IOrderCounterparty;
	ship?: IOrderCounterparty;
	shipperCounterparty?: IOrderCounterparty;

	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		orderService: ExpressOrderService,
		private readonly contactService: ContactService,
	) {
		super('OrderTruckerSummaryComponent', route, teamParams, orderService);
		route.queryParams?.subscribe({
			next: params => {
				this.truckerID = params['truckerID'];
				console.log('truckerID', this.truckerID);
				if (this.order?.dto) {
					this.setTrucker();
				}
			},
		});
	}

	private setTrucker(): void {
		this.truckerCounterparty = this?.order?.dto?.counterparties?.find(c => c.role === 'trucker' && c.contactID === this.truckerID);
	}

	protected override onOrderChanged(order: IExpressOrderContext) {
		super.onOrderChanged(order);
		const counterparties = this.order?.dto?.counterparties;
		if (this.truckerID) {
			this.setTrucker();
		}
		this.selfCounterparty = counterparties?.find(c => c.contactID === this.team?.id);
		this.ship = counterparties?.find(c => c.role === 'ship');
		this.shipperCounterparty = counterparties?.find(c => c.role === 'shipper');
	}
}
