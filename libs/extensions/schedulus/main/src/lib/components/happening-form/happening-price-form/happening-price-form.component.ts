import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Input,
	Output,
	ViewChild,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonSelect, ModalController } from '@ionic/angular';
import { CurrencyCode, IHappeningContext } from '@sneat/mod-schedulus-core';
import { SelectOption, WizardModule } from '@sneat/wizard';

@Component({
	selector: 'sneat-happening-price-form',
	templateUrl: 'happening-price-form.component.html',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		IonicModule,
		ReactiveFormsModule,
		WizardModule,
		FormsModule,
	],
})
export class HappeningPriceFormComponent {
	@Input({ required: true }) happening?: IHappeningContext;

	// @ViewChild('termLengthSelect', { static: false })
	// termLengthSelect?: IonSelect;

	@Output() readonly canceled = new EventEmitter<void>();

	constructor(
		protected changeDetectorRef: ChangeDetectorRef,
		protected readonly modalCtrl: ModalController,
	) {
		this.setTermLengths();
	}

	protected readonly priceValue = new FormControl<number | undefined>(
		undefined,
	);

	protected readonly priceCurrency = new FormControl<CurrencyCode | undefined>(
		'EUR',
	);

	protected readonly termLength = new FormControl<number | undefined>(1);
	protected termUnit?: string;

	protected termLengths: SelectOption[] = [];

	protected onTermLengthChange(): void {
		// console.log('onTermLengthChange', event);
		this.setTermLengths();
		this.forceSelectOptionsRefresh();
	}

	private forceSelectOptionsRefresh(): void {
		// For some reason, the select options are not refreshed when the ion-select-option changes.
		// this.termLengthSelect?.
		const temUnit = this.termUnit;
		this.termUnit = undefined;
		this.changeDetectorRef.detectChanges();
		this.termUnit = temUnit;
		this.changeDetectorRef.detectChanges();
	}

	private setTermLengths(): void {
		const isPlural = (this.termLength.value || 0) > 1;
		this.termLengths = [
			{ value: 'single', title: 'Single event' },
			{ value: 'hour', title: isPlural ? 'Hours' : 'Hour' },
			{ value: 'day', title: isPlural ? 'Days' : 'Day' },
			{ value: 'week', title: 'Week' },
			{ value: 'month', title: 'Month' },
			{ value: 'year', title: 'Year' },
		];
	}
}
