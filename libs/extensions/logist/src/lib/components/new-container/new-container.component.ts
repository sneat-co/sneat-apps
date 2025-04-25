import { NgIf } from '@angular/common';
import { Component, Inject, Input, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	IonButton,
	IonContent,
	IonFooter,
	IonHeader,
	IonIcon,
	IonInput,
	IonItem,
	IonLabel,
	IonSpinner,
	ModalController,
} from '@ionic/angular/standalone';
import { DialogHeaderComponent } from '@sneat/components';
import {
	createSetFocusToInput,
	ISelectItem,
	SelectFromListComponent,
} from '@sneat/ui';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/space-models';
import {
	ContainerType,
	IAddContainersRequest,
	ILogistOrderContext,
	INewContainerPoint,
} from '../../dto';
import { LogistOrderService } from '../../services';
import {
	ShippingPointsSelectorComponent,
	TasksByID,
} from '../shipping-points-selector';

@Component({
	selector: 'sneat-new-container',
	templateUrl: './new-container.component.html',
	imports: [
		IonHeader,
		DialogHeaderComponent,
		IonContent,
		SelectFromListComponent,
		FormsModule,
		IonItem,
		IonLabel,
		IonInput,
		IonFooter,
		IonButton,
		IonIcon,
		IonSpinner,
		ShippingPointsSelectorComponent,
		NgIf,
	],
})
export class NewContainerComponent {
	@Input() order?: ILogistOrderContext;
	@Input({ required: true }) space?: ISpaceContext;

	@ViewChild('containerNumberInput', { static: false })
	containerNumberInput?: IonInput;

	private tasksByShippingPoint?: TasksByID;

	readonly containerTypes: ISelectItem[] = [
		{ id: '8ft', title: '8 ft.' },
		{ id: '10ft', title: '10 ft.' },
		{ id: '20ft', title: '20 ft.' },
		{ id: '20ftHighCube', title: '20 ft. High Cube' },
		{ id: '40ft', title: '40 ft.' },
		{ id: '40ftHighCube', title: '40 ft. High Cube' },
	];

	containerType?: string;
	containerNumber = '';
	isSubmitting = false;

	public readonly setFocusToInput = createSetFocusToInput(this.errorLogger);

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly modalController: ModalController,
		private readonly orderService: LogistOrderService,
	) {}

	onContainerTypeChanged(): void {
		setTimeout(() => this.setFocusToInput(this.containerNumberInput), 100);
	}

	close(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		this.modalController.dismiss().catch(console.error);
	}

	onTasksByShippingPointChanged(tasksByShippingPoint: TasksByID): void {
		this.tasksByShippingPoint = tasksByShippingPoint;
	}

	addContainer(event: Event): void {
		if (!this.order) {
			return;
		}
		if (!this.space?.id) {
			this.errorLogger.logError('No team id provided');
			return;
		}
		if (!this.containerType) {
			alert('container type must be selected');
			return;
		}
		if (
			this.containerNumber?.trim() &&
			this?.order?.dbo?.containers?.some(
				(c) => c.number === this.containerNumber.trim(),
			)
		) {
			alert(
				'There is already container with the same number added to the order.',
			);
			return;
		}
		if (this.order.id) {
			const getPoints: () => INewContainerPoint[] = () => {
				return Object.entries(this.tasksByShippingPoint || {})
					.filter(([, selected]) => selected?.tasks?.length)
					.map(([shippingPointID, selected]) => {
						const point: INewContainerPoint = {
							shippingPointID,
							tasks: selected?.tasks || [],
						};
						return point;
					});
			};
			this.isSubmitting = true;
			const request: IAddContainersRequest = {
				orderID: this.order.id,
				spaceID: this.space.id,
				containers: [
					{
						type: this.containerType as ContainerType,
						number: this.containerNumber,
						points: getPoints(),
					},
				],
			};
			this.orderService.addContainers(request).subscribe({
				next: () => this.close(event),
				error: (err) => {
					this.errorLogger.logError(err);
					setTimeout(() => (this.isSubmitting = false), 1000);
				},
			});
		} else {
			this.errorLogger.logError('Not implemented yet');
			return;
		}
	}
}
