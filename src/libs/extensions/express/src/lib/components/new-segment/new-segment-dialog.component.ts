import { Component, Inject, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { IExpressOrderContext, IOrderContainer } from '../..';

@Component({
	selector: 'sneat-new-segment-dialog',
	templateUrl: 'new-segment-dialog.component.html'
})
export class NewSegmentDialogComponent {
	@Input() order?: IExpressOrderContext;
	@Input() container?: IOrderContainer;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly modalController: ModalController,
	) {
	}

	protected close(): void {
		this.modalController
			.dismiss()
			.catch(this.errorLogger.logErrorHandler('failed to close NewSegmentComponent'));
	}
}
