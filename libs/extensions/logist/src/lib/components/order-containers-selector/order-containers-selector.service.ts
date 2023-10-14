import { Inject, Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ISelectorOptions, SelectorBaseService } from '@sneat/components';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ILogistOrderContext } from '../../dto';
import { IContainer } from './condainer-interface';
import { OrderContainersSelectorDialogComponent } from './order-containers-selector-dialog.component';

@Injectable()
export class OrderContainersSelectorService extends SelectorBaseService<IContainer> {
	constructor(
		@Inject(ErrorLogger) errorLogger: IErrorLogger,
		modalController: ModalController,
	) {
		super(OrderContainersSelectorDialogComponent, errorLogger, modalController);
	}

	public selectOrderContainersInModal(
		order?: ILogistOrderContext,
	): Promise<IContainer[] | null> {
		const options: ISelectorOptions<IContainer> = {
			componentProps: {
				order,
			},
			// selectedItems: [...(order?.dto?.containers || [])],
		};
		return this.selectMultipleInModal(options);
	}
}
