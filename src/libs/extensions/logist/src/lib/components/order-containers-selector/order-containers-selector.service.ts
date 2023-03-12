import { Inject, Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ISelectorOptions, SelectorBaseService } from '@sneat/components';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ILogistOrderContext, IOrderContainer } from '../../dto';
import { OrderContainersSelectorComponent } from './order-containers-selector.component';

@Injectable()
export class OrderContainersSelectorService extends SelectorBaseService<IOrderContainer> {
	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		modalController: ModalController,
	) {
		super(OrderContainersSelectorComponent, errorLogger, modalController);
	}

	public selectOrderContainersInModal(order?: ILogistOrderContext): Promise<IOrderContainer[] | null> {
		const options: ISelectorOptions<IOrderContainer> = {
			componentProps: {
				order,
			},
			// selectedItems: [...(order?.dto?.containers || [])],
		};
		return this.selectMultipleInModal(options);
	}
}
