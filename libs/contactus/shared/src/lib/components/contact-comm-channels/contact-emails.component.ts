import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import {
	CommChannelsListComponent,
	importsForChannelsListComponent,
} from './comm-channels-list.component';

@Component({
	imports: importsForChannelsListComponent,
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'sneat-contact-emails',
	templateUrl: 'comm-channels-list.component.html',
})
export class ContactEmailsComponent extends CommChannelsListComponent {
	constructor() {
		super(
			'ContactEmailsComponent',
			'email',
			'Emails',
			'email@address',
			computed(() => this.$contact().dbo?.emails),
		);
	}
}
