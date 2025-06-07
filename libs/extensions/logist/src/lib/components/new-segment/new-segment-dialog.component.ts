import { Component, Input, inject } from '@angular/core';
import {
	IonContent,
	IonHeader,
	ModalController,
} from '@ionic/angular/standalone';
import { DialogHeaderComponent } from '@sneat/components';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ILogistOrderContext, IOrderContainer } from '../../dto';
import { OrderNavService } from '../../services';
import { NewSegmentFormComponent } from './new-segment-form.component';

@Component({
	selector: 'sneat-new-segment-dialog',
	templateUrl: 'new-segment-dialog.component.html',
	imports: [
		IonHeader,
		DialogHeaderComponent,
		IonContent,
		NewSegmentFormComponent,
	],
})
export class NewSegmentDialogComponent {
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	private readonly modalController = inject(ModalController);
	private readonly orderNavService = inject(OrderNavService);

	@Input() order?: ILogistOrderContext;
	@Input() container?: IOrderContainer;

	protected close(): void {
		// this.modalController
		// 	.dismiss()
		// 	.catch(this.errorLogger.logErrorHandler('failed to close NewSegmentComponent'));
		if (!this.order) {
			throw new Error('order is required');
		}
		this.orderNavService
			.goOrderPage('back', this.order)
			.catch(this.errorLogger.logErrorHandler('failed to go to order page'));
	}
}
