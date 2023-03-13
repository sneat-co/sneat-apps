import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IOrderShippingPoint, ShippingPointTask } from '../../dto';

export type TasksByID = { [id: string]: readonly ShippingPointTask[] | undefined };

@Component({
	selector: 'sneat-shipping-points-selector',
	templateUrl: './shipping-points-selector.component.html',
})
export class ShippingPointsSelectorComponent {
	@Input() shippingPoints?: ReadonlyArray<IOrderShippingPoint>;
	@Output() tasksByShippingPointChange = new EventEmitter<TasksByID>();

	protected readonly tasksByShippingPoint: TasksByID = {};

	checkboxChanged(event: Event, shippingPointID: string, task: ShippingPointTask): void {
		const ce = event as CustomEvent;
		console.log('checkboxChanged', ce);
		let tasks = this.tasksByShippingPoint[shippingPointID] || [];
		const checked = !!ce.detail.checked;
		if (checked) {
			if (!tasks.includes(task)) {
				this.tasksByShippingPoint[shippingPointID] = [...tasks, task];
			}
		} else {
			this.tasksByShippingPoint[shippingPointID] = tasks.filter(t => t !== task);
		}
		this.tasksByShippingPointChange.emit(this.tasksByShippingPoint);
	}
}
