import { Component, Inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team/models';
import { IContainerPoint, IExpressOrderContext, IOrderShippingPoint } from '../../dto';
import { ExpressOrderService } from '../../services';

@Component({
	selector: 'sneat-order-container-point',
	templateUrl: './order-container-point.component.html',
})
export class OrderContainerPointComponent implements OnChanges {
	@Input() containerPoint?: IContainerPoint;
	@Input() shippingPoints?: readonly IOrderShippingPoint[];
	@Input() order?: IExpressOrderContext;
	@Input() team?: ITeamContext;

	shippingPoint?: IOrderShippingPoint;

	deleting = false;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly orderService: ExpressOrderService,
	) {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['containerPoint'] || changes['order']) {
			this.shippingPoint = this.containerPoint?.shippingPointID ? this.order?.dto?.shippingPoints?.find(sp => sp.id === this.containerPoint?.shippingPointID) : undefined;
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
