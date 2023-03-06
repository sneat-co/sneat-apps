import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { TeamComponentBaseParams } from '@sneat/team/components';
import { first } from 'rxjs';
import { LogistOrderService } from '../..';
import { NewContainerComponent } from '../../components/new-container/new-container.component';
import { INewSegmentParams, NewSegmentService } from '../../components/new-segment/new-segment.service';
import { OrderPageBaseComponent } from '../order-page-base.component';

type OrderDetailsTab = 'containers' | 'truckers' | 'points' | 'segments' | 'notes';

@Component({
	selector: 'sneat-order-page',
	templateUrl: './logist-order-page.component.html',
	styleUrls: ['./logist-order-page.component.scss'],
})
export class LogistOrderPageComponent extends OrderPageBaseComponent {


	tab: OrderDetailsTab = 'containers';

	constructor(
		route: ActivatedRoute,
		teamParams: TeamComponentBaseParams,
		orderService: LogistOrderService,
		private readonly newSegmentService: NewSegmentService,
		private readonly modalController: ModalController,
	) {
		super('ExpressOrderPageComponent', route, teamParams, orderService);
		try {
			route.queryParamMap.pipe(first()).subscribe(params => {
				this.tab = params.get('tab') as OrderDetailsTab || this.tab;
			});
		} catch (e) {
			this.errorLogger.logError(e);
		}
	}

	onTabChanged(event: Event): void {
		try {
			console.log('onTabChanged', event);
			// this.changeDetector?.markForCheck();
			let { href } = location;
			if (href.indexOf('?') < 0) {
				href += '?tab=';
			}
			href = href.replace(
				/tab=\w*/,
				`tab=${this.tab}`,
			);
			history.replaceState(history.state, document.title, href);
		} catch (e) {
			this.errorLogger.logError(e, 'failed to handle tab change');
		}
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
