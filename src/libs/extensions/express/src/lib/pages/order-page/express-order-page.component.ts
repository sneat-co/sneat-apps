import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { ExpressOrderService } from '../..';
import { NewContainerComponent } from '../../components/new-container/new-container.component';
import { NewSegmentFormComponent } from '../../components/new-segment';
import { INewSegmentParams, NewSegmentService } from '../../components/new-segment/new-segment.service';
import { OrderPageBaseComponent } from '../order-page-base.component';

type OrderDetailsTab = 'containers' | 'truckers' | 'dispatchers' | 'segments' | 'notes';

@Component({
	selector: 'sneat-order-page',
	templateUrl: './express-order-page.component.html',
	styleUrls: ['./express-order-page.component.scss'],
})
export class ExpressOrderPageComponent extends OrderPageBaseComponent {


	tab: OrderDetailsTab = 'containers';

	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		orderService: ExpressOrderService,
		private readonly newSegmentService: NewSegmentService,
		private readonly modalController: ModalController,
	) {
		super('OrderPageComponent', route, teamParams, orderService);
		route.queryParamMap.subscribe(params => {
			this.tab = params.get('tab') as OrderDetailsTab || this.tab;
		});
	}

	onTabChanged(event: Event): void {
		let { href } = location;
		if (href.indexOf('?') < 0) {
			href += '?tab=';
		}
		href = href.replace(
			/tab=\w*/,
			`tab=${this.tab}`,
		);
		history.replaceState(history.state, document.title, href);
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
		const props: INewSegmentParams = {
			order: this.order,
		};
		try {
			// await this.newSegmentService.openNewSegmentDialog(props);
			this.newSegmentService.goNewSegmentPage(props).catch(console.error);
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
