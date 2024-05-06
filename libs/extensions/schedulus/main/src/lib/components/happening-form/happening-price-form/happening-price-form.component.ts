import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	ChangeDetectorRef,
	Component,
	EventEmitter,
	Inject,
	Input,
	Output,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	CurrencyCode,
	IHappeningContext,
	TermUnit,
} from '@sneat/mod-schedulus-core';
import {
	HappeningService,
	IHappeningPricesRequest,
} from '@sneat/team-services';
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

	protected isSubmitting = false;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		protected readonly changeDetectorRef: ChangeDetectorRef,
		protected readonly modalCtrl: ModalController,
		protected readonly happeningService: HappeningService,
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
	protected termUnit?: TermUnit;

	protected termPeriods: SelectOption[] = [];

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
		this.termPeriods = [
			{ value: 'single', title: 'Single event' },
			{ value: 'hour', title: isPlural ? 'Hours' : 'Hour' },
			{ value: 'day', title: isPlural ? 'Days' : 'Day' },
			{ value: 'week', title: 'Week' },
			{ value: 'month', title: 'Month' },
			{ value: 'year', title: 'Year' },
		];
	}

	protected submitAddPrice(event: Event): void {
		console.log('submitAddPrice');
		event.stopPropagation();
		event.preventDefault();

		const teamID = this.happening?.team?.id,
			happeningID = this.happening?.id;

		if (!happeningID) {
			this.errorLogger.logError('!happeningID');
			return;
		}
		if (!teamID) {
			this.errorLogger.logError('!teamID');
			return;
		}
		if (!this.termUnit) {
			this.errorLogger.logError('!termUnit');
			return;
		}
		const termLength: number = this.termLength.value || 0;
		if (!termLength) {
			this.errorLogger.logError('!termLength');
			return;
		}

		const amountValue = this.priceValue.value || 0;
		const currency = this.priceCurrency.value || '';

		const request: IHappeningPricesRequest = {
			teamID,
			happeningID,
			prices: [
				{
					id: '',
					term: {
						unit: this.termUnit,
						length: termLength,
					},
					amount: {
						value: amountValue,
						currency,
					},
				},
			],
		};

		this.isSubmitting = true;
		this.happeningService.setHappeningPrices(request).subscribe({
			error: this.errorLogger.logErrorHandler(
				'failed to add price to a happening',
			),
			complete: () => {
				this.isSubmitting = false;
			},
			next: () => {
				this.modalCtrl
					.dismiss()
					.catch(
						this.errorLogger.logErrorHandler(
							'Failed to dismiss new happening price modal',
						),
					);
			},
		});
	}
}
