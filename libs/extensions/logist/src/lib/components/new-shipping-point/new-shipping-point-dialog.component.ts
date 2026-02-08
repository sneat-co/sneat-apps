import { Component, Input, inject } from '@angular/core';
import {
	IonContent,
	IonHeader,
	ModalController,
} from '@ionic/angular/standalone';
import { DialogHeaderComponent } from '@sneat/components';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
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
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	protected readonly modalController = inject(ModalController);

	@Input() order?: ILogistOrderContext;
	@Input() container?: IOrderContainer;

	protected onOrderCreated(order: ILogistOrderContext): void {
		this.modalController
			.dismiss(order)
			.catch(this.errorLogger.logErrorHandler('Failed to dismiss modal'));
	}
}
