import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';
import { IOrderContext } from '../../dto/order';

@Component({
	selector: 'sneat-orders-page',
	templateUrl: 'orders-page.component.html',
})
export class OrdersPageComponent extends TeamBaseComponent {
	type?: 'export' | 'import' | 'internal' | '';
	status: 'active' | 'complete' | 'canceled' = 'active';
	counterparty = '';
	carrier = '';
	shipper = '';
	countryOrigin = '';
	countryDestination = '';

	freights: IOrderContext[] = [
		{
			id: 'f1',
			dto: {
				buyer: { id: 'rusconltd', title: 'RUSCON LTD', countryID: 'ru' },
				buyerRef: 'RCN987',
				carrier: { id: 'c1', title: 'Carrier #1', countryID: 'es' },
				carrierRef: 'CR1X234',
				shipper: { id: 'sealand', title: 'SeaLand', countryID: 'es' },
				shipperRef: 'SL357',
				consignee: { id: 'fswpl', title: 'FUTURE STONE WORKS PRIVATE LTD', countryID: 'ru' },
				consigneeRef: 'FSW468',
			},
		},
	];

	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
	) {
		super('OrdersPageComponent', route, teamParams);
	}
}
