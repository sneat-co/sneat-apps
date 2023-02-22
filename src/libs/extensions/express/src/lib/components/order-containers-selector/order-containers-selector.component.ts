import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { IExpressOrderContext } from '../..';
import { IContainer } from './condainer-interface';


@Component({
	selector: 'sneat-order-containers-selector',
	templateUrl: './order-containers-selector.component.html',
})
export class OrderContainersSelectorComponent implements OnChanges {
	@Input() order?: IExpressOrderContext;

	containers?: IContainer[];

	@Input() selectedContainerIDs: string[] = [];
	@Output() readonly selectedContainerIDsChange = new EventEmitter<string[]>();
	@Output() selectedContainersChange = new EventEmitter<IContainer[]>();

	id = (_: number, c: IContainer) => c.id;

	hasUncheckedContainers(): boolean {
		return !!this.containers?.some(c => !c.checked);
	}

	onToggled(): void {
		const selectedContainers = this.containers?.filter(c => c.checked) || [];
		this.selectedContainerIDs = selectedContainers.map(c => c.id);
		console.log('OrderContainersSelectorComponent.selectedContainerIDs:', this.selectedContainerIDs);
		this.selectedContainerIDsChange.emit(this.selectedContainerIDs);
		this.selectedContainersChange.emit(selectedContainers)
	}

	addAllContainer(): void {
		this.containers = this.containers?.map(c => c.checked ? c : {
			...c,
			checked: true,
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		const orderChange = changes['order'];
		if (orderChange) {
			// const previousOrder = orderChange.previousValue as IExpressOrderContext | undefined;
			this.containers = this.order?.dto?.containers?.map(c => ({
				id: c.id,
				type: c.type,
				number: c.number,
				grossWeightKg: c.grossWeightKg,
				numberOfPallets: c.numberOfPallets,
				checked: !!this.containers?.find(cc => cc.id === c.id)?.checked,
			}));
		}
	}

}
