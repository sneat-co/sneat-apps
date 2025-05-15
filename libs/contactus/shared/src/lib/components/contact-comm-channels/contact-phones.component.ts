import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { ICommChannelListItem } from './comm-channel-item.component';
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
		const $channels = computed<readonly ICommChannelListItem[] | undefined>(
			() => {
				return [];
				// const phones = this.$contact()?.dbo?.phones;
				// return Object.entries(phones || {}).map(([number, props]) => ({
				// 	number,
				// 	...props,
				// }));
			},
		);
		super('ContactPhonesComponent', 'Phones', 'Phone #', $channels);
	}
}
