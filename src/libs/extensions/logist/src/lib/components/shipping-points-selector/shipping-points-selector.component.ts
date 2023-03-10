import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IOrderShippingPoint } from '../../dto';

@Component({
	selector: 'sneat-shipping-points-selector',
	templateUrl: './shipping-points-selector.component.html',
})
export class ShippingPointsSelectorComponent {
	@Input() shippingPoints?: ReadonlyArray<IOrderShippingPoint>;
	@Input() selectedShippingPointIDs: ReadonlyArray<string> = [];
	@Output() selectedShippingPointIDsChange = new EventEmitter<string[]>();

	checkboxChanged(event: Event): void {
		const ce = event as CustomEvent;
		console.log('checkboxChanged', ce);
		const value = ce.detail.value as string;
		if (ce.detail.checked) {
			if (!this.selectedShippingPointIDs.includes(value)) {
				this.selectedShippingPointIDs = [...this.selectedShippingPointIDs, value];
			}
		} else {
			this.selectedShippingPointIDs = this.selectedShippingPointIDs.filter(id => id !== value);
		}
		this.selectedShippingPointIDsChange.emit([...this.selectedShippingPointIDs])
	}
}
