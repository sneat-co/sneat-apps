import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HappeningComponentBaseParams } from '../../components/happening-component-base-params';
import { HappeningBasePage } from './happening-base-page';

@Component({
	selector: 'sneat-happening-page',
	templateUrl: './happening-page.component.html',
	providers: [HappeningComponentBaseParams], // TODO: get rid of it by using a dedicated module
})
export class HappeningPageComponent extends HappeningBasePage {

	constructor(
		route: ActivatedRoute,
		params: HappeningComponentBaseParams,
	) {
		super('HappeningPageComponent', route, params);
	}
}
