import { Component } from '@angular/core';
import { IFreightContext } from '../../dto/freight';

@Component({
	selector: 'sneat-shipping-page',
	templateUrl: 'counterparties-page.component.html',
})
export class CounterpartiesPageComponent {
	type?: 'export' | 'import' | 'internal' | '';
	status: 'active' | 'complete' | 'canceled' = 'active';
	counterparty = '';
	carrier = '';
	shipper = '';
	countryOrigin = '';
	countryDestination = '';

	freights: IFreightContext[] = [
		{
			id: 'f1',
			dto: {
				buyer: {id: 'rusconltd', title: 'RUSCON LTD', countryID: 'ru'},
				buyerRef: 'RCN987',
				carrier: {id: 'c1', title: 'Carrier #1', countryID: 'es'},
				carrierRef: 'CR1X234',
				shipper: {id: 'sealand', title: 'SeaLand', countryID: 'es'},
				shipperRef: 'SL357',
				consignee: {id: 'fswpl', title: 'FUTURE STONE WORKS PRIVATE LTD', countryID: 'ru'},
				consigneeRef: 'FSW468',
			}
		}
	];
}
