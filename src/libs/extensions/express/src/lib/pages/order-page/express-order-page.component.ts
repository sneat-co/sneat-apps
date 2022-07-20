import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { FreightOrdersService } from '../..';
import { NewContainerComponent } from '../../components/new-container/new-container.component';
import { NewSegmentComponent } from '../../components/new-segment';
import { OrderPageBaseComponent } from '../order-page-base.component';

@Component({
	selector: 'sneat-order-page',
	templateUrl: './express-order-page.component.html',
	styleUrls: ['./express-order-page.component.scss'],
})
export class ExpressOrderPageComponent extends OrderPageBaseComponent {
	tab: 'segments' | 'containers' | 'notes' = 'containers';

	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		orderService: FreightOrdersService,
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
		const modal = await this.modalController.create({
			component: NewSegmentComponent,
			componentProps: {
				order: this.order,
				team: this.team,
			},
		});
		await modal.present();
	}
}
