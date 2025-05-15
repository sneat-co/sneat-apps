import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import {
	CommChannelItemComponent,
	ICommChannelListItem,
} from './comm-channel-item.component';
import {
	CommChannelsListComponent,
	importsForChannelsListComponent,
} from './comm-channels-list.component';

@Component({
	imports: [importsForChannelsListComponent, CommChannelItemComponent],
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'sneat-contact-emails',
	templateUrl: 'comm-channels-list.component.html',
})
export class ContactEmailsComponent extends CommChannelsListComponent {
	constructor() {
		const $channels = computed<readonly ICommChannelListItem[] | undefined>(
			() => {
				return [{ id: 'alex@example.com', type: 'personal' }];
				// const emails = this.$contact()?.dbo?.emails;
				// return (
				// 	Object.entries(emails || {}).map(([address, props]) => ({
				// 		address,
				// 		...props,
				// 	})) || [{ address: 'alex@example.com', type: 'personal' }]
				// );
			},
		);
		super('ContactEmailsComponent', 'Emails', 'email@address', $channels);
	}
}
