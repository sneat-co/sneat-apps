import { Inject, Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ISelectorOptions, SelectorBaseService } from '@sneat/components';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ILogistOrderContext, IOrderContainer, IOrderShippingPoint } from '../../dto';
import { ShippingPintsSelectorDialogComponent } from './shipping-pints-selector-dialog.component';

@Injectable()
export class ShippingPointsSelectorService extends SelectorBaseService<IOrderShippingPoint> {
	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		modalController: ModalController,
	) {
		super(ShippingPintsSelectorDialogComponent, errorLogger, modalController);
	}

	public selectShippingPointsInModal(order: ILogistOrderContext, container: IOrderContainer): Promise<IOrderShippingPoint[] | null> {
		const options: ISelectorOptions<IOrderShippingPoint> = {
			// selectedItems: [...(order.dto?.shippingPoints || [])],
			componentProps: { order, container },
		};
		return this.selectMultipleInModal(options);
	}
}
