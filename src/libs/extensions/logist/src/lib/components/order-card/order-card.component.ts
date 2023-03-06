import { Component, Inject, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';
import { LogistOrderContactRole } from '@sneat/dto';
import { ErrorLogger, IErrorLogger } from '@sneat/logging';
import { ITeamContext } from '@sneat/team/models';
import { ILogistOrderContext } from '../../dto/order-dto';
import { LogistOrderService } from '../../services';
import { OrderPrintMenuComponent } from './order-print-menu.component';

@Component({
	selector: 'sneat-logist-order-card',
	templateUrl: './order-card.component.html',
	styleUrls: ['./order-card.component.scss'],
})
export class OrderCardComponent {
	@Input() public readonly = false;
	@Input() team?: ITeamContext;
	@Input() order?: ILogistOrderContext;
	@Input() hideDispatchers = false;
	readonly roles: LogistOrderContactRole[] = ['buyer', 'consignee', 'agent', 'carrier', 'shipper'];

	constructor(
		@Inject(ErrorLogger) private readonly errorLogger: IErrorLogger,
		private readonly popoverController: PopoverController,
		private readonly orderService: LogistOrderService,
	) {
	}

	protected copyNumberToClipboard(event: Event): void {
		event.stopPropagation();
		event.preventDefault();
		const text = this.order?.id;
		if (text) {
			navigator.clipboard.writeText(text)
				.then(() => alert('Order number copied to clipboard: ' + text))
				.catch(err => alert('Error copying order number to clipboard: ' + err));
		}
	}

	protected async showPrintMenu(event: Event): Promise<void> {
		event.stopPropagation();
		event.preventDefault();
		const popover = await this.popoverController.create({
			component: OrderPrintMenuComponent,
			componentProps: {
				team: this.team,
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
		const team = this.team;
		if (!team) {
			throw new Error('No team context');
		}
		const order = this.order;
		if (!order?.id) {
			throw new Error('No order context');
		}
		if (this.order?.dto?.status === status) {
			return;
		}
		this.orderService.setOrderStatus({ teamID: team.id, orderID: order.id, status }).subscribe({
			error: this.errorLogger.logErrorHandler('Failed to set order status'),
		});
	}
}
