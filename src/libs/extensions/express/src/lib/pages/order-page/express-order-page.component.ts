import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { ExpressOrderService } from '../..';
import { NewContainerComponent } from '../../components/new-container/new-container.component';
import { NewSegmentComponent } from '../../components/new-segment';
import { NewSegmentService } from '../../components/new-segment/new-segment.service';
import { OrderPageBaseComponent } from '../order-page-base.component';

@Component({
	selector: 'sneat-order-page',
	templateUrl: './express-order-page.component.html',
	styleUrls: ['./express-order-page.component.scss'],
})
export class ExpressOrderPageComponent extends OrderPageBaseComponent {
	tab: 'containers' | 'truckers' | 'dispatchers' | 'segments' | 'notes' = 'containers';

	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		orderService: ExpressOrderService,
		private readonly newSegmentService: NewSegmentService,
		private readonly modalController: ModalController,
	) {
		super('OrderPageComponent', route, teamParams, orderService);
	}

	async addContainer(): Promise<void> {
		const modal = await this.modalController.create({
			component: NewContainerComponent,
			componentProps: {
				order: this.order,
				team: this.team,
			},
		});
		await modal.present();
	}

	async addSegment(): Promise<void> {
		if (!this.order) {
			return;
		}
		try {
			await this.newSegmentService.addSegment({
				order: this.order,
			});
		} catch (e) {
			this.errorLogger.logError(e, 'Failed to open new segment form');
		}
	}

	async addDispatcher(): Promise<void> {
		if (!this.order) {
			return;
		}
		// await this.newSegmentService.addSegment({
		// 	order: this.order,
		// });
	}
}
