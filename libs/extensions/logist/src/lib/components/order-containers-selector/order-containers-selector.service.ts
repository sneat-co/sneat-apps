import { Injectable } from '@angular/core';
import { ISelectorOptions, SelectorBaseService } from '@sneat/ui';
import { ILogistOrderContext } from '../../dto';
import { IContainer } from './condainer-interface';
import { OrderContainersSelectorDialogComponent } from './order-containers-selector-dialog.component';

@Injectable()
export class OrderContainersSelectorService extends SelectorBaseService<IContainer> {
	constructor() {
		super(OrderContainersSelectorDialogComponent);
	}

	public selectOrderContainersInModal(
		order?: ILogistOrderContext,
	): Promise<IContainer[] | undefined> {
		const options: ISelectorOptions<IContainer> = {
			componentProps: {
				order,
			},
			// selectedItems: [...(order?.dto?.containers || [])],
		};
		return this.selectMultipleInModal(options);
	}
}
