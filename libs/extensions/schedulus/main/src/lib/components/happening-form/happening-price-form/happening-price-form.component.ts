import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	Output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { IHappeningContext } from '@sneat/mod-schedulus-core';
import { WizardModule } from '@sneat/wizard';

@Component({
	selector: 'sneat-happening-price-form',
	templateUrl: 'happening-price-form.component.html',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [CommonModule, IonicModule, ReactiveFormsModule, WizardModule],
})
export class HappeningPriceFormComponent {
	@Input({ required: true }) happening?: IHappeningContext;

	@Output() readonly canceled = new EventEmitter<void>();

	constructor(protected readonly modalCtrl: ModalController) {}

	protected readonly priceValue = new FormControl<number | undefined>(
		undefined,
	);

	protected get priceLabel(): string {
		return this.happening?.brief?.type === 'recurring'
			? 'Price per visit'
			: 'Price';
	}
}
