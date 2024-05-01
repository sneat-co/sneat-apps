import { Component } from '@angular/core';
import { getRelatedItemIDs } from '@sneat/dto';
import {
	HappeningBaseComponent,
	HappeningComponent,
} from '../happening-base.component';

@Component({
	selector: 'sneat-happening-card',
	templateUrl: 'happening-card.component.html',
	styleUrls: ['happening-card.component.scss'],
	providers: [...HappeningBaseComponent.providers],
	...HappeningBaseComponent.metadata,
})
export class HappeningCardComponent extends HappeningComponent {
	protected hasRelatedContacts(): boolean {
		return !!getRelatedItemIDs(
			this.happening?.brief?.related,
			'contactus',
			'contacts',
		).length;
	}

	protected getRelatedContactIDs(): readonly string[] {
		return getRelatedItemIDs(
			this.happening?.dto?.related || this.happening?.brief?.related,
			'contactus',
			'contacts',
		);
	}
}
