import { Component, Input } from '@angular/core';
import { IContainerPoint, IOrderShippingPoint, ShippingPointTask } from '../../dto';

@Component({
	selector: 'sneat-container-point-load-form',
	templateUrl: 'container-point-load-form.component.html',
})
export class ContainerPointLoadFormComponent {
	@Input() task?: ShippingPointTask;
	@Input() shippingPoint?: IOrderShippingPoint;
	@Input() containerPoint?: IContainerPoint;

	readonly label = () => this.task ? this.task[0].toUpperCase() + this.task.slice(1) : '';

	does(task?: ShippingPointTask): boolean {
		const v = !!task && !!this.containerPoint?.tasks?.includes(task);
		console.log('does', task, v);
		return v;
	}

	onTaskChecked(event: Event): void {
		const task = this.task;
		if (!task || !this.containerPoint) {
			return;
		}
		const checked = (event as CustomEvent).detail.checked;

		if (checked) {
			this.containerPoint = { ...this.containerPoint, tasks: [...(this.containerPoint.tasks || []), task] };
		} else {
			this.containerPoint = { ...this.containerPoint, tasks: this.containerPoint.tasks?.filter(t => t !== task) };
		}
		console.log('onTaskChecked()', task, checked, this.containerPoint.tasks);
	}

}
