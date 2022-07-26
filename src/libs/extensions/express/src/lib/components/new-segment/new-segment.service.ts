import { Inject, Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IExpressOrderContext, IOrderContainer } from '@sneat/extensions/express';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { NewSegmentComponent } from './new-segment.component';

export interface INewContainerParams {
	order: IExpressOrderContext;
	container?: IOrderContainer;
}

@Injectable()
export class NewSegmentService {
	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly modalController: ModalController,
	) {
	}

	async addSegment(componentProps: INewContainerParams): Promise<void> {
		const modal = await this.modalController.create({
			component: NewSegmentComponent,
			componentProps,
		});
		await modal.present();
	}
}
