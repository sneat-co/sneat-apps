import { Directive, input, signal, Signal } from '@angular/core';
import {
	IonButton,
	IonButtons,
	IonCard,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonSelect,
	IonSelectOption,
} from '@ionic/angular/standalone';
import { IContactContext } from '@sneat/contactus-core';
import { SneatBaseComponent } from '@sneat/ui';
import {
	CommChannelItemComponent,
	ICommChannelListItem,
} from './comm-channel-item.component';

export const importsForChannelsListComponent = [
	IonCard,
	IonLabel,
	IonItem,
	IonSelect,
	IonSelectOption,
	IonButtons,
	IonButton,
	IonIcon,
	IonInput,
	CommChannelItemComponent,
];

@Directive({})
export abstract class CommChannelsListComponent extends SneatBaseComponent {
	protected $showAddForm = signal(false);

	public readonly $contact = input.required<IContactContext | undefined>();

	protected readonly $channels: Signal<
		readonly ICommChannelListItem[] | undefined
	>;

	protected readonly $title = signal('');
	protected readonly $placeholder = signal('');

	protected constructor(
		className: 'ContactEmailsComponent' | 'ContactPhonesComponent',
		title: string,
		placeholder: string,
		$channels: Signal<readonly ICommChannelListItem[] | undefined>,
	) {
		super(className);
		this.$channels = $channels;
		this.$title.set(title);
		this.$placeholder.set(placeholder);
	}
}
