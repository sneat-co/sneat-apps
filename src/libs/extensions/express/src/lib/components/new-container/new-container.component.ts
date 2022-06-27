import { Component, Inject, Input, ViewChild } from '@angular/core';
import { IonInput, ModalController } from '@ionic/angular';
import { createSetFocusToInput, ISelectItem } from '@sneat/components';
import {
	ContainerType,
	FreightOrdersService,
	IAddContainersRequest,
	IExpressOrderContext,
} from '../..';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team/models';

@Component({
	selector: 'sneat-new-container',
	templateUrl: './new-container.component.html',
})
export class NewContainerComponent {

	@Input() order?: IExpressOrderContext;
	@Input() team?: ITeamContext;

	@ViewChild('containerNumberInput', { static: false }) containerNumberInput?: IonInput;

	readonly containerTypes: ISelectItem[] = [
		{ id: '20ft', title: '20 ft.' },
		{ id: '40ft', title: '40 ft.' },
	];

	containerType?: string;
	containerNumber = '';
	grossWeightKg?: number;
	isSubmitting = false;

	public readonly setFocusToInput = createSetFocusToInput(this.errorLogger);

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly modalController: ModalController,
		private readonly orderService: FreightOrdersService,
	) {
	}

	onContainerTypeChanged(): void {
		setTimeout(() => this.setFocusToInput(this.containerNumberInput), 100);
	}

	close(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		this.modalController.dismiss().catch(console.error);
	}

	addContainer(event: Event): void {
		if (!this.order) {
			return;
		}
		if (!this.team?.id) {
			this.errorLogger.logError('No team id provided');
			return;
		}
		if (!this.containerType) {
			alert('container type must be selected');
			return;
		}
		if (this.order.id) {
			this.isSubmitting = true;
			const request: IAddContainersRequest = {
				orderID: this.order.id,
				teamID: this.team.id,
				containers: [
					{
						type: this.containerType as ContainerType,
						number: this.containerNumber,
					},
				],
			};
			this.orderService.addContainers(request).subscribe({
				next: () => this.close(event),
				error: err => {
					this.errorLogger.logError(err);
					setTimeout(() => this.isSubmitting = false, 1000);
				},
			});
		} else {
			this.errorLogger.logError('Not implemented yet');
			return;
		}
	}
}
