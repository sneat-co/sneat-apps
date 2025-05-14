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

interface email extends ICommunicationChannelProps {
	address: string;
}

@Component({
	imports: [IonCard, IonLabel, IonItem],
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'sneat-contact-emails',
	templateUrl: 'contact-emails.component.html',
})
export class ContactEmailsComponent {
	public readonly $contact = input.required<IContactContext | undefined>();

	protected readonly $emails = computed<readonly email[]>(() => {
		const emails = this.$contact()?.dbo?.emails;
		return Object.entries(emails || {}).map(([address, props]) => ({
			address,
			...props,
		}));
	});
}
