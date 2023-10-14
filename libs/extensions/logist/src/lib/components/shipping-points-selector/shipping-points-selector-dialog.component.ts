import { Component, Inject, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	IAddContainerPointsRequest,
	ILogistOrderContext,
	IOrderContainer,
} from '../../dto';
import { LogistOrderService } from '../../services';
import { TasksByID } from './shipping-points-selector.component';

@Component({
	selector: 'sneat-shipping-pints-selector-dialog',
	templateUrl: './shipping-points-selector-dialog.component.html',
})
export class ShippingPointsSelectorDialogComponent {
	@Input() title = 'Select shipping points for container';
	@Input() order?: ILogistOrderContext;
	@Input() container?: IOrderContainer;

	protected submitting = false;
	protected tasksByID?: TasksByID;

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly orderService: LogistOrderService,
		private readonly modalController: ModalController,
	) {}

	protected onTasksByShippingPointIDChanged(tasksByID: TasksByID): void {
		console.log(
			'ShippingPintsSelectorDialogComponent.onTasksByShippingPointIDChanged()',
			tasksByID,
		);
		this.tasksByID = Object.keys(tasksByID).length ? tasksByID : undefined;
	}

	protected submit(): void {
		const order = this.order;
		const containerID = this.container?.id;
		const tasksByID = this.tasksByID;
		if (!order || !containerID || !tasksByID) {
			return;
		}

		const request: IAddContainerPointsRequest = {
			teamID: order.team.id,
			orderID: order.id,
			containerPoints: Object.entries(tasksByID)
				.filter(([, selected]) => selected?.tasks.length)
				.map(([shippingPointID, selected]) => {
					return {
						containerID,
						shippingPointID,
						tasks: selected?.tasks || [],
						status: 'pending',
					};
				}),
		};
		this.submitting = true;
		this.orderService.addContainerPoints(request).subscribe({
			next: () => {
				this.modalController
					.dismiss()
					.catch(
						this.errorLogger.logErrorHandler(
							'Failed to close modal of ShippingPointsSelectorDialogComponent',
						),
					);
			},
			error: this.errorLogger.logErrorHandler('Failed to add container points'),
		});
	}
}
