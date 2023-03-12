import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ILogistOrderContext } from '../../dto/order-dto';
import { IContainer } from './condainer-interface';


@Component({
	selector: 'sneat-order-containers-selector',
	templateUrl: './order-containers-selector.component.html',
})
export class OrderContainersSelectorComponent implements OnChanges, OnInit {
	@Input() order?: ILogistOrderContext;
	@Input() disabled?: boolean;

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
		this.selectedContainersChange.emit(selectedContainers);
	}

	addAllContainer(): void {
		this.containers = this.containers?.map(c => c.checked ? c : {
			...c,
			checked: true,
		});
	}

	ngOnInit(): void { // Needed for modal dialog as ngOnChanges is not called for the first change
		this.setContainers();
	}

	ngOnChanges(changes: SimpleChanges): void {
		console.log('OrderContainersSelectorComponent.ngOnChanges():', changes);
		const orderChange = changes['order'];
		if (orderChange) {
			// const previousOrder = orderChange.previousValue as ILogistOrderContext | undefined;
			this.setContainers();
		}
	}

	private setContainers(): void {
		this.containers = this.order?.dto?.containers?.map(c => ({
			id: c.id,
			type: c.type,
			number: c.number,
			checked: !!this.containers?.find(cc => cc.id === c.id)?.checked,
		}));
	}
}
