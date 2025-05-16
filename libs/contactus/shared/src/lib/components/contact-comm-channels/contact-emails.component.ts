import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { ICommChannelListItem } from './comm-channel-item.component';
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
		const $channels = computed<readonly ICommChannelListItem[] | undefined>(
			() => {
				const emails = this.$contact()?.dbo?.emails;
				return (
					Object.entries(emails || {}).map(([id, props]) => ({
						id,
						...props,
					})) || [{ address: 'alex@example.com', type: 'personal' }]
				);
			},
		);
		super(
			'ContactEmailsComponent',
			'email',
			'Emails',
			'email@address',
			$channels,
		);
	}
}
