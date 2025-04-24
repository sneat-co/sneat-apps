import { Component, Inject, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonContent, IonHeader } from '@ionic/angular/standalone';
import { DialogHeaderComponent } from '@sneat/components';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ILogistOrderContext, IOrderContainer } from '../../dto';
import { NewShippingPointFormComponent } from './new-shipping-point-form.component';

@Component({
	selector: 'sneat-new-shipping-point',
	templateUrl: './new-shipping-point-dialog.component.html',
	imports: [
		IonHeader,
		DialogHeaderComponent,
		IonContent,
		NewShippingPointFormComponent,
	],
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
