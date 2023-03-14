import { ChangeDetectorRef, Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { excludeEmpty } from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { BehaviorSubject, debounceTime, distinctUntilChanged, Observable, Subject } from 'rxjs';
import {
	FreightPointField, FreightPointIntField,
	IContainerPoint, IFreightLoad,
	ILogistOrderContext,
	IOrderShippingPoint, ISetContainerPointDatesRequest, ISetContainerPointFreightFieldsRequest,
	ISetContainerPointTaskRequest, ShippingPointDateField,
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

	private readonly $date = new BehaviorSubject<string | undefined>(undefined);
	private readonly date$ = debounce(this.$date);

	private readonly $weight = new BehaviorSubject<number | undefined>(undefined);
	private readonly weight$ = debounce(this.$weight);

	private readonly $pallets = new BehaviorSubject<number | undefined>(undefined);
	private readonly pallets$ = debounce(this.$pallets);

	protected dateFieldName: ShippingPointDateField = undefined as unknown as ShippingPointDateField;
	protected unchangedDate?: string;

	readonly label = () => this.task ? this.task[0].toUpperCase() + this.task.slice(1) : '';

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly orderService: LogistOrderService,
		private readonly changeDetector: ChangeDetectorRef,
	) {
		console.log('ContainerPointLoadFormComponent.constructor()');
		this.date$.subscribe(this.onDateDebounced);
		this.weight$.subscribe(v => this.onNumberDebounced('grossWeightKg', v));
		this.pallets$.subscribe(v => this.onNumberDebounced('numberOfPallets', v));
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

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['task']) {
			this.dateFieldName = this.task === 'load' ? 'departsDate' : 'arrivesDate';
		}
		this.checked = this.does(this.task);
		this.unchangedDate = this.containerPoint?.[this.dateFieldName];
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

	protected onInputChanged(name: FreightPointField, event: Event): void {
		console.log('ContainerPointLoadFormComponent.onNumberChanged()', name, event);
		const ce = event as CustomEvent;
		switch (name) {
			case 'grossWeightKg':
				this.$weight.next(+ce.detail.value);
				break;
			case 'numberOfPallets':
				this.$pallets.next(+ce.detail.value);
				break;
			case 'arrivesDate':
			case 'departsDate':
				this.$date.next(ce.detail.value as string);
				break;
		}
	}

	private onNumberDebounced(name: FreightPointIntField, number?: number): void {
		switch (name) {
			case 'grossWeightKg':
				if (number === this.freightLoad?.grossWeightKg) {
					return;
				}
				this.setNumberField(name, number);
				break;
			case 'numberOfPallets':
				if (number === this.freightLoad?.numberOfPallets) {
					return;
				}
				this.setNumberField(name, number);
				break;
		}
	}

	private readonly onDateDebounced = (date?: string): void => {
		if (date === this.unchangedDate) {
			return;
		}
		this.setDateField(date);
	};

	private setDateField(date?: string): void {
		const name = this.dateFieldName;
		console.log('ContainerPointLoadFormComponent.setDateField()', name, date);
		const
			task = this.task,
			shippingPointID = this.shippingPoint?.id,
			containerID = this.containerPoint?.containerID,
			orderID = this.order?.id,
			teamID = this.order?.team?.id;

		if (!task || !containerID || !shippingPointID || !orderID || !teamID || !this.containerPoint) {
			return;
		}
		this.containerPoint = { ...this.containerPoint, [name]: date };
		const request: ISetContainerPointDatesRequest = {
			teamID,
			orderID,
			shippingPointID,
			containerID,
			task,
			dates: { [name]: date },
		};
		this.orderService.setContainerPointDates(request).subscribe({
			next: () => console.log('setContainerPointDate() success'),
			error: this.errorLogger.logErrorHandler(`Failed to set container point date field ${name}`),
		});
	}

	private setNumberField(name: FreightPointIntField, number?: number): void {
		console.log('ContainerPointLoadFormComponent.setNumberField()', name, number);
		const
			task = this.task,
			shippingPointID = this.shippingPoint?.id,
			containerID = this.containerPoint?.containerID,
			orderID = this.order?.id,
			teamID = this.order?.team?.id;

		if (!task || !containerID || !shippingPointID || !orderID || !teamID || !this.containerPoint) {
			return;
		}
		this.freightLoad = { ...this.freightLoad, [name]: number };
		const request: ISetContainerPointFreightFieldsRequest = {
			teamID,
			orderID,
			shippingPointID,
			containerID,
			task,
			integers: { [name]: number },
		};
		this.orderService.setContainerPointFreightFields(excludeEmpty(request)).subscribe({
			next: () => console.log('setContainerPointNumber() success'),
			error: this.errorLogger.logErrorHandler(`Failed to set container point freight field ${name}`),
		});
	}
}
