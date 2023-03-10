import { Inject, Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ILogistOrderContext, IOrderContainer } from '../../dto';
import { OrderNavService } from '../../services';
import { NewShippingPointDialogComponent } from './new-shipping-point-dialog.component';

export interface INewShippingPointParams {
	order: ILogistOrderContext;
	container?: IOrderContainer;
}

@Injectable()
export class NewShippingPointService {
	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly modalController: ModalController,
		private readonly orderNavService: OrderNavService,
	) {
	}

	async openNewShippingPointDialog(componentProps: INewShippingPointParams): Promise<HTMLIonModalElement> {
		const modal = await this.modalController.create({
			component: NewShippingPointDialogComponent,
			componentProps,
			cssClass: 'sneat-tall-modal',
		});
		await modal.present();
		return modal;
	}
}
