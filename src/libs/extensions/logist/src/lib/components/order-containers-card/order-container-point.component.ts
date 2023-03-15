import { ChangeDetectorRef, Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team/models';
import { IContainerPoint, ILogistOrderContext, IOrderShippingPoint, ISetContainerPointFieldsRequest } from '../../dto';
import { LogistOrderService } from '../../services';

@Component({
	selector: 'sneat-order-container-point',
	templateUrl: './order-container-point.component.html',
})
export class OrderContainerPointComponent implements OnChanges {
	@Input() team?: ITeamContext;
	@Input() order?: ILogistOrderContext;
	// @Input() shippingPoint?: IOrderShippingPoint;
	@Input() containerPoint?: IContainerPoint;

	protected shippingPoint?: IOrderShippingPoint;

	protected readonly specialInstructions = new FormControl<string>('');

	protected deleting = false;
	protected saving = false;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly orderService: LogistOrderService,
		private readonly changeDetector: ChangeDetectorRef,
	) {
	}

	cancelChanges(): void {
		this.specialInstructions.setValue(this.containerPoint?.specialInstructions || '');
		this.specialInstructions.markAsPristine();
	}

	onSpecialInstructionsChanged(): void {
		if (this.specialInstructions.value === (this.containerPoint?.specialInstructions || '')) {
			this.specialInstructions.markAsPristine();
		}
	}

	saveSpecialInstructions(): void {
		const teamID = this.team?.id,
			orderID = this.order?.id,
			containerID = this.containerPoint?.containerID,
			shippingPointID = this.containerPoint?.shippingPointID;
		if (!teamID || !orderID || !containerID || !shippingPointID) {
			return;
		}
		const request: ISetContainerPointFieldsRequest = {
			teamID, orderID, containerID, shippingPointID,
			setStrings: { specialInstructions: this.specialInstructions.value || '' },
		};
		this.saving = true;
		const complete = () => {
			this.saving = false;
			this.changeDetector.markForCheck();
		};
		this.orderService.setContainerPointFields(request).subscribe({
			next: () => {
				this.specialInstructions.markAsPristine();
				complete();
			},
			error: err => {
				this.errorLogger.logError(err, 'Failed to save special instructions');
				complete();
			},
			// complete, // TODO: does not work for some reason - needs to be fixed
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['containerPoint'] || changes['order']) {
			this.shippingPoint = this.containerPoint?.shippingPointID ? this.order?.dto?.shippingPoints?.find(sp => sp.id === this.containerPoint?.shippingPointID) : undefined;
			if (this.containerPoint && !this.specialInstructions.dirty) {
				this.specialInstructions.setValue(this.containerPoint.specialInstructions || '');
			}
		}
	}

	delete(event: Event): void {
		console.log('ContainerPointComponent.delete()', event);
		const teamID = this.team?.id;
		if (!teamID) {
			throw new Error('ContainerPointComponent.delete(): teamID is not defined');
		}
		const orderID = this.order?.id;
		if (!orderID) {
			throw new Error('ContainerPointComponent.delete(): orderID is not defined');
		}
		const containerID = this.containerPoint?.containerID;
		if (!containerID) {
			throw new Error('ContainerPointComponent.delete(): containerPoint is not defined');
		}
		const shippingPointID = this.containerPoint?.shippingPointID;
		if (!shippingPointID) {
			throw new Error('ContainerPointComponent.delete(): shippingPointID is not defined');
		}
		this.deleting = true;
		this.orderService.deleteContainerPoints({
			teamID,
			orderID,
			containerID,
			shippingPointIDs: [shippingPointID],
		}).subscribe({
			complete: () => {
				this.deleting = false;
			},
			error: this.errorLogger.logErrorHandler('Failed to delete container point'),
		});
	}

}
