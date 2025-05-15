import {
	ChangeDetectionStrategy,
	Component,
	effect,
	Input,
	input,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
	IonButton,
	IonButtons,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonSelect,
	IonSelectOption,
} from '@ionic/angular/standalone';
import { ICommunicationChannelProps } from '@sneat/contactus-core';

export interface ICommChannelListItem extends ICommunicationChannelProps {
	readonly id: string;
}

@Component({
	imports: [
		IonButton,
		IonButtons,
		IonIcon,
		IonInput,
		IonItem,
		IonSelect,
		IonSelectOption,
		ReactiveFormsModule,
		IonLabel,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'sneat-comm-channel-item',
	templateUrl: 'comm-channel-item.component.html',
})
export class CommChannelItemComponent {
	protected readonly value = new FormControl();
	public readonly $isLast = input.required<boolean>();
	public $channel = input.required<ICommChannelListItem>();

	constructor() {
		effect(() => {
			const channel = this.$channel();
			if (!this.value.dirty) {
				this.value.setValue(channel.id);
			}
		});
	}
}
