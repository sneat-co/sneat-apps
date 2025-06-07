import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import {
	CommChannelsListComponent,
	importsForChannelsListComponent,
} from './comm-channels-list.component';
import { ClassName } from '@sneat/ui';

@Component({
	imports: importsForChannelsListComponent,
	providers: [
		{
			provide: ClassName,
			useValue: 'ContactPhonesComponent',
		},
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'sneat-contact-phones',
	templateUrl: 'comm-channels-list.component.html',
})
export class ContactPhonesComponent extends CommChannelsListComponent {
	constructor() {
		super(
			'phone',
			'Phones',
			'Phone #',
			computed(() => this.$contact().dbo?.phones),
		);
	}
}
