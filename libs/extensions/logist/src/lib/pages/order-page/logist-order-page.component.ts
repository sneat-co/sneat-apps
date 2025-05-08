import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
	ModalController,
	PopoverController,
	ToastController,
	IonBackButton,
	IonBadge,
	IonButton,
	IonButtons,
	IonCol,
	IonContent,
	IonGrid,
	IonHeader,
	IonIcon,
	IonLabel,
	IonRow,
	IonSegment,
	IonSegmentButton,
	IonText,
	IonTitle,
	IonToolbar,
} from '@ionic/angular/standalone';
import { first } from 'rxjs';
import { DispatchersComponent } from '../../components';
import { NewContainerComponent } from '../../components/new-container/new-container.component';
import { NewSegmentService } from '../../components/new-segment/new-segment.service';
import {
	INewShippingPointParams,
	NewShippingPointService,
} from '../../components/new-shipping-point/new-shipping-point.service';
import { OrderCardComponent } from '../../components/order-card/order-card.component';
import { OrderPrintMenuComponent } from '../../components/order-card/order-print-menu.component';
import { OrderContainersComponent } from '../../components/order-containers-card';
import { OrderSegmentsComponent } from '../../components/order-segments/order-segments.component';
import { OrderTruckersComponent } from '../../components/order-truckers/order-truckers.component';
import { LogistOrderService } from '../../services';
import { OrderPageBaseComponent } from '../order-page-base.component';

type OrderDetailsTab =
	| 'containers'
	| 'truckers'
	| 'points'
	| 'segments'
	| 'notes';

@Component({
	selector: 'sneat-order-page',
	templateUrl: './logist-order-page.component.html',
	imports: [
		IonHeader,
		IonToolbar,
		IonButtons,
		IonBackButton,
		IonTitle,
		IonButton,
		IonIcon,
		IonLabel,
		IonContent,
		IonGrid,
		IonRow,
		IonCol,
		IonSegment,
		FormsModule,
		IonSegmentButton,
		IonBadge,
		IonText,
		NgSwitchCase,
		NgSwitch,
		OrderSegmentsComponent,
		OrderTruckersComponent,
		OrderContainersComponent,
		OrderCardComponent,
		DispatchersComponent,
		NgIf,
	],
})
export class LogistOrderPageComponent
	extends OrderPageBaseComponent
	implements OnDestroy
{
	tab: OrderDetailsTab = 'containers';

	private modal?: HTMLIonModalElement;

	constructor(
		orderService: LogistOrderService,
		private readonly newSegmentService: NewSegmentService,
		private readonly newShippingPointService: NewShippingPointService,
		private readonly modalController: ModalController,
		private readonly popoverController: PopoverController,
		private readonly toastController: ToastController,
	) {
		super('LogistOrderPageComponent', orderService);
		try {
			this.route.queryParamMap
				.pipe(first(), this.takeUntilDestroyed())
				.subscribe((params) => {
					this.tab = (params.get('tab') as OrderDetailsTab) || this.tab;
				});
		} catch (e) {
			this.errorLogger.logError(e);
		}
	}

	protected copyNumberToClipboard(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		const text = this.order?.id;
		if (text) {
			navigator.clipboard
				.writeText(text)
				.then(() => {
					this.toastController
						.create({
							message: 'Order number copied to clipboard: ' + text,
							duration: 1500,
						})
						.then((toast) => toast.present());
				})
				.catch((err) =>
					alert('Error copying order number to clipboard: ' + err),
				);
		}
	}

	protected async showPrintMenu(event: Event): Promise<void> {
		event.stopPropagation();
		event.preventDefault();
		const popover = await this.popoverController.create({
			component: OrderPrintMenuComponent,
			componentProps: {
				space: this.space,
				order: this.order,
			},
		});
		await popover.present(event as MouseEvent);
	}

	onTabChanged(event: Event): void {
		try {
			console.log('onTabChanged', event);
			// this.changeDetector?.markForCheck();
			let { href } = location;
			if (!href.includes('?')) {
				href += '?tab=';
			}
			href = href.replace(/tab=\w*/, `tab=${this.tab}`);
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
				space: this.space,
			},
		});
		await modal.present();
	}

	protected addSegment(): void {
		const order = this.order;
		if (!order) {
			return;
		}
		this.newSegmentService
			.goNewSegmentPage({ order })
			.catch(
				this.errorLogger.logErrorHandler(
					'Failed to navigate to new segment page',
				),
			);
	}

	addShippingPoint(): void {
		if (!this.order) {
			return;
		}
		const props: INewShippingPointParams = {
			order: this.order,
		};
		this.newShippingPointService
			.openNewShippingPointDialog(props)
			.then((modal) => {
				this.modal = modal;
				modal.onDidDismiss().then(() => {
					this.modal = undefined;
				});
			})
			.catch(
				this.errorLogger.logErrorHandler(
					'Failed to open new shipping point form',
				),
			);
	}

	override ngOnDestroy() {
		this.modal
			?.dismiss()
			.catch(this.errorLogger.logErrorHandler('Failed to dispose modal'));
		super.ngOnDestroy();
	}
}
