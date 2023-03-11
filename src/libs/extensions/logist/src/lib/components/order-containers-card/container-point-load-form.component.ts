import { ChangeDetectorRef, Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	FreightPointField,
	IContainerPoint, IFreightLoad,
	ILogistOrderContext,
	IOrderShippingPoint, ISetContainerPointNumberRequest,
	ISetContainerPointTaskRequest,
	ShippingPointTask,
} from '../../dto';
import { LogistOrderService } from '../../services';

@Component({
	selector: 'sneat-container-point-load-form',
	templateUrl: 'container-point-load-form.component.html',
})
export class ContainerPointLoadFormComponent implements OnChanges {
	@Input() order?: ILogistOrderContext;
	@Input() task?: ShippingPointTask;
	@Input() shippingPoint?: IOrderShippingPoint;
	@Input() containerPoint?: IContainerPoint;

	protected freightLoad?: IFreightLoad;
	protected checked?: boolean;

	readonly label = () => this.task ? this.task[0].toUpperCase() + this.task.slice(1) : '';

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly orderService: LogistOrderService,
		private readonly changeDetector: ChangeDetectorRef,
	) {
		console.log('ContainerPointLoadFormComponent.constructor()');
	}

	does(task?: ShippingPointTask): boolean {
		const v = !!task && !!this.containerPoint?.tasks?.includes(task);
		console.log('does', task, v);
		return v;
	}

	onTaskChecked(event: Event): boolean | void {

		const checked = !!(event as CustomEvent).detail.checked;

		if (checked === this.does(this.task)) {
			return;
		}

		const
			task = this.task,
			shippingPointID = this.shippingPoint?.id,
			containerID = this.containerPoint?.containerID,
			orderID = this.order?.id,
			teamID = this.order?.team?.id;

		if (!task || !containerID || !shippingPointID || !orderID || !teamID || !this.containerPoint) {
			return false;
		}

		if (!checked && this.containerPoint.tasks?.length === 1) {
			requestAnimationFrame(() => {
				this.checked = this.does(task);
				this.changeDetector.detectChanges();
				alert('At least one task must be selected');
			});
			return false;
		}

		if (checked) {
			this.containerPoint = { ...this.containerPoint, tasks: [...(this.containerPoint.tasks || []), task] };
		} else {
			this.containerPoint = { ...this.containerPoint, tasks: this.containerPoint.tasks?.filter(t => t !== task) };
		}
		const request: ISetContainerPointTaskRequest = {
			teamID,
			orderID,
			shippingPointID,
			containerID,
			task,
			value: checked,
		};
		this.orderService.setContainerPointTask(request).subscribe({
			next: () => console.log('setContainerPointTask() success'),
			error: this.errorLogger.logErrorHandler('Failed to set container point task'),
		});
		console.log('onTaskChecked()', task, checked, this.containerPoint.tasks);
	}

	ngOnChanges(changes: SimpleChanges): void {
		this.checked = this.does(this.task);
		switch (this.task) {
			case 'load':
				this.freightLoad = this.containerPoint?.toLoad;
				break;
			case 'unload':
				this.freightLoad = this.containerPoint?.toUnload;
				break;
		}
	}

	onNumberChanged(name: FreightPointField, event: Event): void {
		const
			task = this.task,
			shippingPointID = this.shippingPoint?.id,
			containerID = this.containerPoint?.containerID,
			orderID = this.order?.id,
			teamID = this.order?.team?.id;

		if (!task || !containerID || !shippingPointID || !orderID || !teamID || !this.containerPoint) {
			return;
		}
		const ce = event as CustomEvent;
		const request: ISetContainerPointNumberRequest = {
			teamID,
			orderID,
			shippingPointID,
			containerID,
			task,
			name,
			value: +ce.detail.value,
		};
		// TODO: should be debounced and/or onBlur event should be used
		this.orderService.setContainerPointNumber(request).subscribe({
			next: () => console.log('setContainerPointNumber() success'),
		});
	}
}
