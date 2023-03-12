import { Inject, Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ISelectorOptions, SelectorBaseService } from '@sneat/components';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ILogistOrderContext, IOrderShippingPoint } from '../../dto';
import { ShippingPointsSelectorComponent } from './shipping-points-selector.component';

@Injectable()
export class ShippingPointsSelectorService extends SelectorBaseService<IOrderShippingPoint> {
	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		modalController: ModalController,
	) {
		super(ShippingPointsSelectorComponent, errorLogger, modalController);
	}

	public selectShippingPointsInModal(order?: ILogistOrderContext): Promise<IOrderShippingPoint[] | null> {
		const options: ISelectorOptions<IOrderShippingPoint> = {
			selectedItems: [...(order?.dto?.shippingPoints || [])],
		};
		return this.selectMultipleInModal(options);
	}
}
