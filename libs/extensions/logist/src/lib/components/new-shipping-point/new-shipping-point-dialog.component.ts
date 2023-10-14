import { Component, Inject, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ILogistOrderContext, IOrderContainer } from '../../dto';

@Component({
	selector: 'sneat-new-shipping-point',
	templateUrl: './new-shipping-point-dialog.component.html',
})
export class NewShippingPointDialogComponent {
	@Input() order?: ILogistOrderContext;
	@Input() container?: IOrderContainer;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		protected readonly modalController: ModalController,
	) {}

	protected onOrderCreated(order: ILogistOrderContext): void {
		this.modalController
			.dismiss(order)
			.catch(this.errorLogger.logErrorHandler('Failed to dismiss modal'));
	}
}
