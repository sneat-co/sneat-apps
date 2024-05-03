import { CommonModule } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IHappeningContext } from '@sneat/mod-schedulus-core';
import { HappeningPriceFormComponent } from '../happening-price-form/happening-price-form.component';

@Component({
	selector: 'sneat-happening-pricing',
	templateUrl: 'happening-prices.component.html',
	standalone: true,
	imports: [CommonModule, IonicModule, HappeningPriceFormComponent],
})
export class HappeningPricesComponent {
	@Input({ required: true }) happening?: IHappeningContext;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly modalCtrl: ModalController,
	) {}

	protected openNewPriceForm(): void {
		this.modalCtrl
			.create({
				component: HappeningPriceFormComponent,
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
}
