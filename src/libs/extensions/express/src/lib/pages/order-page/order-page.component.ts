import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';

@Component({
	selector: 'sneat-order-page',
	templateUrl: './order-page.component.html',
	styleUrls: ['./order-page.component.scss'],
})
export class OrderPageComponent extends TeamBaseComponent {
	tab: 'containers' | 'notes' = 'containers';

	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
	) {
		super('OrderPageComponent', route, teamParams);
	}
}
