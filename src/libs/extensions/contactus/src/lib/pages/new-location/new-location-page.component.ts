import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ContactComponentBaseParams } from '../../contact-component-base-params';
import { ContactBasePage } from '../contact-base-page';

@Component({
	selector: 'sneat-new-location-page',
	templateUrl: './new-location-page.component.html',
})
export class NewLocationPageComponent extends ContactBasePage {
	constructor(
		route: ActivatedRoute,
		params: ContactComponentBaseParams,
	) {
		super('ContactPageComponent', route, params);
		this.defaultBackPage = 'contacts';
	}
}
