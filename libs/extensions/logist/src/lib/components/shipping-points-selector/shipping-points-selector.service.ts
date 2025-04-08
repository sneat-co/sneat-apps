import { Injectable } from '@angular/core';
import { ISelectorOptions, SelectorBaseService } from '@sneat/ui';
import {
	ILogistOrderContext,
	IOrderContainer,
	IOrderShippingPoint,
} from '../../dto';
import { ShippingPointsSelectorDialogComponent } from './shipping-points-selector-dialog.component';

@Injectable()
export class ShippingPointsSelectorService extends SelectorBaseService<IOrderShippingPoint> {
	constructor() {
		super(ShippingPointsSelectorDialogComponent);
	}

	public selectShippingPointsInModal(
		order: ILogistOrderContext,
		container: IOrderContainer,
	): Promise<IOrderShippingPoint[] | undefined> {
		const options: ISelectorOptions<IOrderShippingPoint> = {
			// selectedItems: [...(order.dto?.shippingPoints || [])],
			componentProps: { order, container },
		};
		return this.selectMultipleInModal(options);
	}
}
