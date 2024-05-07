import { CommonModule } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	Inject,
	Input,
	signal,
} from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IHappeningContext, IHappeningPrice } from '@sneat/mod-schedulus-core';
import {
	HappeningService,
	IHappeningPricesRequest,
} from '@sneat/team-services';
import { HappeningPriceFormComponent } from '../happening-price-form/happening-price-form.component';

@Component({
	selector: 'sneat-happening-pricing',
	templateUrl: 'happening-prices.component.html',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [
		CommonModule,
		IonicModule,
		HappeningPriceFormComponent,
		SneatPipesModule,
	],
})
export class HappeningPricesComponent {
	@Input({ required: true }) happening?: IHappeningContext;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly modalCtrl: ModalController,
		private readonly happeningService: HappeningService,
	) {}

	protected openNewPriceForm(): void {
		this.modalCtrl
			.create({
				component: HappeningPriceFormComponent,
				componentProps: {
					happening: this.happening,
				},
			})
			.then((modal) => {
				modal
					.present()
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
		if (!confirm('Are you sure you want delete this price?')) {
			return;
		}

		const happeningID = this.happening?.id,
			teamID = this.happening?.team?.id;

		if (!happeningID) {
			return;
		}
		if (!teamID) {
			return;
		}

		this.updatingPriceIDs.set([...this.updatingPriceIDs(), price.id]);

		this.happeningService
			.deleteHappeningPrices({
				teamID,
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

		this.updatingPriceIDs.set([...this.updatingPriceIDs(), price.id]);

		const isChecked = !!(event as CustomEvent).detail.checked;

		const request: IHappeningPricesRequest = {
			teamID: this.happening?.team?.id || '',
			happeningID: this.happening?.id || '',
			prices: [{ ...price, expenseQuantity: isChecked ? 1 : 0 }],
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
