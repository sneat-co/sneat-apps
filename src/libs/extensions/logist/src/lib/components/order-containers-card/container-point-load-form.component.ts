import { ChangeDetectorRef, Component, Inject, Input, OnChanges } from '@angular/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable, Subject } from 'rxjs';
import {
	FreightPointField,
	IContainerPoint, IFreightLoad,
	ILogistOrderContext,
	IOrderShippingPoint, ISetContainerPointNumberRequest,
	ISetContainerPointTaskRequest,
	ShippingPointTask,
} from '../../dto';
import { LogistOrderService } from '../../services';

function debounce<T>(o: Subject<T>): Observable<T> {
	return o.asObservable().pipe(
		distinctUntilChanged(),
		debounceTime(1000),
	);
}

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

	private readonly $weight = new BehaviorSubject<number | undefined>(undefined);
	private readonly weight$ = debounce(this.$weight);

	private readonly $pallets = new BehaviorSubject<number | undefined>(undefined);
	private readonly pallets$ = debounce(this.$pallets);

	readonly label = () => this.task ? this.task[0].toUpperCase() + this.task.slice(1) : '';

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly orderService: LogistOrderService,
		private readonly changeDetector: ChangeDetectorRef,
	) {
		console.log('ContainerPointLoadFormComponent.constructor()');
		this.weight$.subscribe({
			next: value => this.onDebounced('grossWeightKg', value),
		});
		this.pallets$.subscribe({
			next: value => this.onDebounced('numberOfPallets', value),
		});
	}

	does(task?: ShippingPointTask): boolean {
		const v = !!task && !!this.containerPoint?.tasks?.includes(task);
		// console.log('does', task, v);
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

	ngOnChanges(/*changes: SimpleChanges*/): void {
		this.checked = this.does(this.task);
		switch (this.task) {
			case 'load':
				this.freightLoad = this.containerPoint?.toLoad;
				break;
			case 'unload':
				this.freightLoad = this.containerPoint?.toUnload;
				break;
		}
		this.$weight.next(this.freightLoad?.grossWeightKg);
		this.$pallets.next(this.freightLoad?.numberOfPallets);
		console.log('ContainerPointLoadFormComponent.ngOnChanges()', this.task, this.freightLoad);
	}

	protected onBlur(name: FreightPointField, event: Event): void {
		// console.log('ContainerPointLoadFormComponent.onBlur()', name, event);
		// switch (name) {
		// 	case 'grossWeightKg':
		// 		this.onDebounced(name, this.$weight.value);
		// 		break;
		// 	case 'numberOfPallets':
		// 		this.onDebounced(name, this.$pallets.value);
		// 		break;
		// }
	}

	protected onNumberChanged(name: FreightPointField, event: Event): void {
		console.log('ContainerPointLoadFormComponent.onNumberChanged()', name, event);
		const ce = event as CustomEvent;
		const value = +ce.detail.value;
		switch (name) {
			case 'grossWeightKg':
				this.$weight.next(value);
				break;
			case 'numberOfPallets':
				this.$pallets.next(value);
				break;
		}
	}

	private onDebounced(name: FreightPointField, value?: number): void {
		switch (name) {
			case 'grossWeightKg':
				if (value === this.freightLoad?.grossWeightKg) {
					return;
				}
				break;
			case 'numberOfPallets':
				if (value === this.freightLoad?.numberOfPallets) {
					return;
				}
				break;
		}
		const
			task = this.task,
			shippingPointID = this.shippingPoint?.id,
			containerID = this.containerPoint?.containerID,
			orderID = this.order?.id,
			teamID = this.order?.team?.id;

		if (!task || !containerID || !shippingPointID || !orderID || !teamID || !this.containerPoint) {
			return;
		}
		console.log('ContainerPointLoadFormComponent.onDebounced()', name, value);
		this.freightLoad = { ...this.freightLoad, [name]: value };
		const request: ISetContainerPointNumberRequest = {
			teamID,
			orderID,
			shippingPointID,
			containerID,
			task,
			name,
			value,
		};
		this.orderService.setContainerPointNumber(request).subscribe({
			next: () => console.log('setContainerPointNumber() success'),
		});
	}
}
