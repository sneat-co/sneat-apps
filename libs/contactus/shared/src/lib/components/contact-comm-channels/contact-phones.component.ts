import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import {
	CommChannelsListComponent,
	importsForChannelsListComponent,
} from './comm-channels-list.component';

@Component({
	imports: importsForChannelsListComponent,
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'sneat-contact-phones',
	templateUrl: 'comm-channels-list.component.html',
})
export class ContactPhonesComponent extends CommChannelsListComponent {
	constructor() {
		super(
			'ContactPhonesComponent',
			'phone',
			'Phones',
			'Phone #',
			computed(() => this.$contact().dbo?.phones),
		);
	}
}
