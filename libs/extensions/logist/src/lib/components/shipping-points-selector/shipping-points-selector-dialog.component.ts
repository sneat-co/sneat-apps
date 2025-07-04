import { NgIf } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import {
	ModalController,
	IonButton,
	IonContent,
	IonHeader,
	IonLabel,
} from '@ionic/angular/standalone';
import { DialogHeaderComponent } from '@sneat/components';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import {
	IAddContainerPointsRequest,
	ILogistOrderContext,
	IOrderContainer,
} from '../../dto';
import { LogistOrderService } from '../../services';
import {
	ShippingPointsSelectorComponent,
	TasksByID,
} from './shipping-points-selector.component';

@Component({
	selector: 'sneat-shipping-pints-selector-dialog',
	templateUrl: './shipping-points-selector-dialog.component.html',
	imports: [
		IonHeader,
		DialogHeaderComponent,
		IonContent,
		ShippingPointsSelectorComponent,
		IonButton,
		IonLabel,
		NgIf,
	],
})
export class ShippingPointsSelectorDialogComponent {
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	private readonly orderService = inject(LogistOrderService);
	private readonly modalController = inject(ModalController);

	@Input() title = 'Select shipping points for container';
	@Input() order?: ILogistOrderContext;
	@Input() container?: IOrderContainer;

	protected submitting = false;
	protected tasksByID?: TasksByID;

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
			spaceID: order.space.id,
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
