import {
	Component,
	inject,
	Input,
	signal,
	ChangeDetectionStrategy,
} from '@angular/core';
import {
	IonButton,
	IonButtons,
	IonContent,
	IonDatetime,
	IonHeader,
	IonLabel,
	IonTitle,
	IonToolbar,
	PopoverController,
} from '@ionic/angular/standalone';
import { SneatBaseComponent } from '@sneat/ui';

@Component({
	imports: [
		IonDatetime,
		IonHeader,
		IonToolbar,
		IonTitle,
		IonContent,
		IonButton,
		IonButtons,
		IonLabel,
	],
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'sneat-contact-dob-modal',
	templateUrl: 'date-modal.component.html',
})
export class DateModalComponent extends SneatBaseComponent {
	@Input() title?: string;
	@Input() max?: string;

	constructor() {
		super('DateModalComponent');
	}

	private popoverCtrl = inject(PopoverController);

	protected readonly $date = signal<string | undefined>(undefined);

	protected onDateChanged(event: CustomEvent): void {
		let { value } = event.detail;
		if (value) {
			value = (value as string).slice(0, 10);
		}
		this.$date.set(value);
	}

	protected dismiss(): void {
		this.popoverCtrl
			.dismiss(this.$date())
			.catch(this.errorLogger.logErrorHandler('failed to dismiss date modal'));
	}
}
