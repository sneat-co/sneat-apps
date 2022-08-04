import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IExpressOrderContext, IOrderContainer } from '../..';

interface IContainer extends IOrderContainer {
	checked: boolean;
}

@Component({
	selector: 'sneat-order-containers-selector',
	templateUrl: './order-containers-selector.component.html',
})
export class OrderContainersSelectorComponent implements OnChanges{
	@Input() order?: IExpressOrderContext;

	containers?: IContainer[];

	@Input() selectedContainerIDs: string[] = [];
	@Output() readonly selectedContainerIDsChange = new EventEmitter<string[]>();

	hasUncheckedContainers(): boolean {
		return !!this.containers?.some(c => !c.checked);
	}

	onToggled(): void {
		this.selectedContainerIDs = this.containers?.filter(c => c.checked).map(c => c.id) || [];
		console.log('OrderContainersSelectorComponent.selectedContainerIDs:', this.selectedContainerIDs);
		this.selectedContainerIDsChange.emit(this.selectedContainerIDs);
	}

	addAllContainer(): void {
		this.containers = this.containers?.map(c => c.checked ? c : { ...c, checked: true });
	}

	ngOnChanges(changes: SimpleChanges): void {
		const orderChange = changes['order'];
		if (orderChange) {
			// const previousOrder = orderChange.previousValue as IExpressOrderContext | undefined;
			this.containers = this.order?.dto?.containers?.map(c => ({ ...c, checked: !!this.containers?.find(cc => cc.id === c.id)?.checked }));
		}
	}

}
