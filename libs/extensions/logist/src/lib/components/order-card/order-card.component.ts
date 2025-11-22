import { DatePipe } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
	PopoverController,
	ToastController,
	IonButton,
	IonButtons,
	IonCard,
	IonCol,
	IonGrid,
	IonIcon,
	IonInput,
	IonItem,
	IonItemDivider,
	IonItemGroup,
	IonLabel,
	IonRow,
	IonSelect,
	IonSelectOption,
	IonText,
} from '@ionic/angular/standalone';
import { LogistOrderContactRole } from '@sneat/contactus-core';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ISpaceContext } from '@sneat/space-models';
import { ILogistOrderContext } from '../../dto';
import { LogistOrderService } from '../../services';
import { OrderAgentsComponent } from '../order-agents/order-agents.component';
import { OrderCounterpartyComponent } from '../order-counterparty/order-counterparty.component';
import { OrderPrintMenuComponent } from './order-print-menu.component';

@Component({
	selector: 'sneat-logist-order-card',
	templateUrl: './order-card.component.html',
	imports: [
		IonCard,
		IonItem,
		RouterLink,
		IonLabel,
		IonButtons,
		IonButton,
		IonIcon,
		IonGrid,
		IonRow,
		IonCol,
		IonInput,
		IonSelect,
		IonSelectOption,
		IonText,
		IonItemGroup,
		IonItemDivider,
		OrderCounterpartyComponent,
		OrderAgentsComponent,
		DatePipe,
	],
})
export class OrderCardComponent {
	private readonly errorLogger = inject<IErrorLogger>(ErrorLogger);
	private readonly popoverController = inject(PopoverController);
	private readonly orderService = inject(LogistOrderService);
	private readonly toastController = inject(ToastController);

	@Input() public readonly = false;
	@Input({ required: true }) space?: ISpaceContext;
	@Input() order?: ILogistOrderContext;
	@Input() hideDispatchers = false;
	@Input() showHeader = true;
	readonly roles: LogistOrderContactRole[] = [
		'buyer',
		'consignee',
		'dispatch_agent',
		'receive_agent',
		'trucker',
		'shipping_line',
	];

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

	protected onUserChangedOrderStatus(event: Event): void {
		// event.stopPropagation();
		// event.preventDefault();
		console.log('onUserChangedOrderStatus', event);
		const ce = event as CustomEvent;
		const status = ce.detail.value as string;
		if (!status) {
			return;
		}
		const space = this.space;
		if (!space) {
			throw new Error('No space context');
		}
		const order = this.order;
		if (!order?.id) {
			throw new Error('No order context');
		}
		if (this.order?.dbo?.status === status) {
			return;
		}
		this.orderService
			.setOrderStatus({ spaceID: space.id, orderID: order.id, status })
			.subscribe({
				error: this.errorLogger.logErrorHandler('Failed to set order status'),
			});
	}
}
