import { Injectable, inject } from '@angular/core';
import { ModalController } from '@ionic/angular/standalone';
import { excludeUndefined } from '@sneat/core';
import { ErrorLogger, IErrorLogger } from '@sneat/core';
import { ILogistOrderContext, IOrderContainer } from '../../dto';
import { OrderNavService } from '../../services';
import { NewSegmentDialogComponent } from './new-segment-dialog.component';

export interface INewSegmentParams {
	order: ILogistOrderContext;
	container?: IOrderContainer;
}

@Injectable()
export class NewSegmentService {
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	private readonly modalController = inject(ModalController);
	private readonly orderNavService = inject(OrderNavService);

	async openNewSegmentDialog(componentProps: INewSegmentParams): Promise<void> {
		const modal = await this.modalController.create({
			component: NewSegmentDialogComponent,
			componentProps,
			cssClass: 'sneat-tall-modal',
		});
		await modal.present();
	}

	goNewSegmentPage(params: INewSegmentParams): Promise<boolean> {
		return this.orderNavService.goOrderPage(
			'forward',
			params.order,
			{ path: 'new-segments' },
			excludeUndefined({ container: params.container?.id }),
			params as unknown as Record<string, unknown>,
		);
		// navController.navigateForward('new-segments', { relativeTo: route }).catch(console.error);
	}
}
