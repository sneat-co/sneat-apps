import { CurrencyPipe } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	EventEmitter,
	Input,
	Output,
	signal,
	inject,
} from '@angular/core';
import {
	IonButton,
	IonButtons,
	IonCard,
	IonCheckbox,
	IonIcon,
	IonItem,
	IonItemDivider,
	IonLabel,
	IonSpinner,
	ModalController,
} from '@ionic/angular/standalone';
import { Decimal64p2Pipe } from '@sneat/components';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	IHappeningBrief,
	IHappeningContext,
	IHappeningPrice,
} from '@sneat/mod-schedulus-core';
import {
	HappeningService,
	IHappeningPricesRequest,
} from '../../../services/happening.service';
import { HappeningPriceModalComponent } from '../happening-price-form/happening-price-modal.component';

@Component({
	selector: 'sneat-happening-pricing',
	templateUrl: 'happening-prices.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		Decimal64p2Pipe,
		IonCard,
		IonItemDivider,
		IonLabel,
		IonButtons,
		IonButton,
		IonIcon,
		IonItem,
		IonSpinner,
		IonCheckbox,
		CurrencyPipe,
	],
})
export class HappeningPricesComponent {
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	private readonly modalCtrl = inject(ModalController);
	private readonly happeningService = inject(HappeningService);

	@Input({ required: true }) happening?: IHappeningContext;
	@Output() readonly happeningChange = new EventEmitter<IHappeningContext>();

	protected openNewPriceForm(): void {
		this.modalCtrl
			.create({
				component: HappeningPriceModalComponent,
				componentProps: {
					happening: this.happening,
					happeningChange: new EventEmitter<IHappeningContext>(),
				},
			})
			.then((modal) => {
				modal
					.present()
					.then(() => {
						const modalHappeningChange = modal?.componentProps?.[
							'happeningChange'
						] as EventEmitter<IHappeningContext>;
						modalHappeningChange.subscribe({
							next: (happening: IHappeningContext) => {
								console.log('modalHappeningChange =>', happening);
								this.happeningChange.emit(happening);
							},
						});
					})
					.catch(
						this.errorLogger.logErrorHandler(
							'Failed to present modal of new price form',
						),
					);
			})
			.catch(
				this.errorLogger.logErrorHandler(
					'Failed to create modal of new price form',
				),
			);
	}

	protected deletePrice(price: IHappeningPrice): void {
		console.log('deletePrice()', price);
		if (!confirm('Are you sure you want delete this price?')) {
			return;
		}

		const happeningID = this.happening?.id,
			spaceID = this.happening?.space?.id;

		if (!happeningID) {
			const removePrice = <T extends IHappeningBrief>(h: T) => ({
				...h,
				prices: h.prices?.filter((p) => p.id !== price.id),
			});
			let happening = this.happening;
			if (happening?.brief) {
				happening = { ...happening, brief: removePrice(happening.brief) };
			}
			if (happening?.dbo) {
				happening = { ...happening, dbo: removePrice(happening.dbo) };
			}
			this.happeningChange.emit(happening);
			return;
		}

		if (!spaceID) {
			return;
		}

		this.updatingPriceIDs.set([...this.updatingPriceIDs(), price.id]);

		this.happeningService
			.deleteHappeningPrices({
				spaceID: spaceID,
				happeningID,
				priceIDs: [price.id],
			})
			.subscribe({
				error: this.errorLogger.logErrorHandler(
					`Failed to delete happening price with ID=${price.id}`,
				),
				complete: () => {
					this.updatingPriceIDs.set(
						this.updatingPriceIDs().filter((id) => id !== price.id),
					);
				},
			});
	}

	protected updatingPriceIDs = signal<readonly string[]>([]);

	protected priceChecked(price: IHappeningPrice, event: Event): void {
		console.log('priceChecked()', event);
		event.stopPropagation();
		event.preventDefault();

		if (!this.happening) {
			return;
		}

		const isChecked = !!(event as CustomEvent).detail.checked;
		const expenseQuantity = isChecked ? 1 : 0;

		if (!this.happening?.id) {
			const setPrices = <T extends IHappeningBrief>(h: T): T => ({
				...h,
				prices: h.prices?.map((p) =>
					p.id === price.id ? { ...p, expenseQuantity } : p,
				),
			});

			if (this.happening?.brief) {
				this.happening = {
					...this.happening,
					brief: setPrices(this.happening.brief),
				};
			}
			if (this.happening?.dbo) {
				this.happening = {
					...this.happening,
					dbo: setPrices(this.happening.dbo),
				};
			}
			this.happeningChange.emit(this.happening);
			return;
		}

		this.updatingPriceIDs.set([...this.updatingPriceIDs(), price.id]);

		const request: IHappeningPricesRequest = {
			spaceID: this.happening?.space?.id || '',
			happeningID: this.happening?.id || '',
			prices: [{ ...price, expenseQuantity }],
		};
		this.happeningService.setHappeningPrices(request).subscribe({
			complete: () => {
				this.updatingPriceIDs.set(
					this.updatingPriceIDs().filter((id) => id !== price.id),
				);
			},
		});
	}
}
