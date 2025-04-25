import { Component, Inject, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IonContent, IonHeader } from '@ionic/angular/standalone';
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
	@Input() order?: ILogistOrderContext;
	@Input() container?: IOrderContainer;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly modalController: ModalController,
		private readonly orderNavService: OrderNavService,
	) {}

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
