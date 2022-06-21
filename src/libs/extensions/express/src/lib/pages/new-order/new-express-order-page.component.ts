import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeamBaseComponent, TeamComponentBaseParams } from '@sneat/team/components';

@Component({
	selector: 'sneat-new-express-order-page',
	templateUrl: 'new-express-order-page.component.html',
})
export class NewExpressOrderPageComponent extends TeamBaseComponent {
	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
	) {
		super('NewExpressOrderPageComponent', route, teamParams);
		console.log('NewExpressOrderPageComponent');
	}
}
