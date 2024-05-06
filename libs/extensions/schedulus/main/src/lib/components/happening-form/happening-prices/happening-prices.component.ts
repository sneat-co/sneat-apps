import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { SneatPipesModule } from '@sneat/components';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IHappeningContext, IHappeningPrice } from '@sneat/mod-schedulus-core';
import { HappeningService } from '@sneat/team-services';
import { HappeningPriceFormComponent } from '../happening-price-form/happening-price-form.component';

@Component({
	selector: 'sneat-happening-pricing',
	templateUrl: 'happening-prices.component.html',
	standalone: true,
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

	protected isDeleting: string[] = [];

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

		this.isDeleting = [...this.isDeleting, price.id];

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
					this.isDeleting = this.isDeleting.filter((id) => id !== price.id);
				},
			});
	}
}
