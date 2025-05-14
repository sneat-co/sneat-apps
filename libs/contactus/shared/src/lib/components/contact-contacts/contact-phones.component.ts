import {
	ChangeDetectionStrategy,
	Component,
	computed,
	input,
} from '@angular/core';
import { IonCard, IonItem, IonLabel } from '@ionic/angular/standalone';
import {
	ICommunicationChannelProps,
	IContactContext,
} from '@sneat/contactus-core';

interface phone extends ICommunicationChannelProps {
	number: string;
}

@Component({
	imports: [IonCard, IonLabel, IonItem],
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'sneat-contact-phones',
	templateUrl: 'contact-phones.component.html',
})
export class ContactPhonesComponent {
	public readonly $contact = input.required<IContactContext | undefined>();

	protected readonly $phones = computed<readonly phone[]>(() => {
		const phones = this.$contact()?.dbo?.phones;
		return Object.entries(phones || {}).map(([number, props]) => ({
			number,
			...props,
		}));
	});
}
