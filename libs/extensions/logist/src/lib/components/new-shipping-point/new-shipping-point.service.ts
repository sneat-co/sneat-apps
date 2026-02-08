import { Injectable, inject } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { ILogistOrderContext, IOrderContainer } from '../../dto';
import { OrderNavService } from '../../services';
import { NewShippingPointDialogComponent } from './new-shipping-point-dialog.component';

export interface INewShippingPointParams {
	order: ILogistOrderContext;
	container?: IOrderContainer;
}

@Injectable()
export class NewShippingPointService {
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	private readonly modalController = inject(ModalController);
	private readonly orderNavService = inject(OrderNavService);

	async openNewShippingPointDialog(
		componentProps: INewShippingPointParams,
	): Promise<HTMLIonModalElement> {
		const modal = await this.modalController.create({
			component: NewShippingPointDialogComponent,
			componentProps,
			cssClass: 'sneat-tall-modal',
		});
		await modal.present();
		return modal;
	}
}
