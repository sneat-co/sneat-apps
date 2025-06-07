import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import {
	CommChannelsListComponent,
	importsForChannelsListComponent,
} from './comm-channels-list.component';
import { ClassName } from '@sneat/ui';

@Component({
	imports: importsForChannelsListComponent,
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [
		{
			provide: ClassName,
			useValue: 'ContactEmailsComponent',
		},
	],
	selector: 'sneat-contact-emails',
	templateUrl: 'comm-channels-list.component.html',
})
export class ContactEmailsComponent extends CommChannelsListComponent {
	constructor() {
		super(
			'email',
			'Emails',
			'email@address',
			computed(() => this.$contact().dbo?.emails),
		);
	}
}
